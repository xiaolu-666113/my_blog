export type MindMapCategory =
  | "privilege"
  | "architecture"
  | "assembly"
  | "syscall"
  | "memory"
  | "shellcode"
  | "defense"
  | "summary";

export type MindMapLevel = 0 | 1 | 2 | 3;

export interface MindMapNodeData {
  id: string;
  parentId?: string;
  title: string;
  englishTitle?: string;
  level: MindMapLevel;
  category: MindMapCategory;
  summary?: string;
  bullets?: string[];
  importantSentence?: {
    en: string;
    zh: string;
  };
  x: number;
  y: number;
  color: string;
  icon?: string;
  side?: "left" | "right" | "center";
}

export const categoryMeta: Record<
  MindMapCategory,
  { label: string; color: string; soft: string }
> = {
  privilege: { label: "权限相关", color: "#2563eb", soft: "#dbeafe" },
  architecture: { label: "体系结构", color: "#7c3aed", soft: "#ede9fe" },
  assembly: { label: "二进制与汇编", color: "#0f766e", soft: "#ccfbf1" },
  syscall: { label: "系统调用", color: "#ea580c", soft: "#ffedd5" },
  memory: { label: "栈与内存", color: "#16a34a", soft: "#dcfce7" },
  shellcode: { label: "Shellcode", color: "#dc2626", soft: "#fee2e2" },
  defense: { label: "防御", color: "#64748b", soft: "#f1f5f9" },
  summary: { label: "总结", color: "#334155", soft: "#e2e8f0" },
};

export const chapterList = [
  {
    id: "chapter-18",
    title: "第18章：权限提升与 Shellcode",
    englishTitle: "Privilege Escalation and Shellcode",
    status: "已上线",
  },
  { id: "chapter-19", title: "第19章：待开发章节", englishTitle: "Coming Soon", status: "规划中" },
  { id: "chapter-20", title: "第20章：待开发章节", englishTitle: "Coming Soon", status: "规划中" },
];

const rawNodes: Omit<MindMapNodeData, "x" | "y" | "color">[] = [
  {
    id: "center",
    title: "第18章：权限提升与 Shellcode",
    englishTitle: "Privilege Escalation and Shellcode",
    level: 0,
    category: "summary",
    side: "center",
    summary:
      "本章先讲 Linux 权限机制与权限提升，再讲计算机底层执行模型、汇编、寄存器、栈、系统调用，最后引出 Shellcode 注入及现代防御机制。",
    importantSentence: {
      zh: "权限、执行流、内存字节和 CPU 跳转位置，是理解本章的四条主线。",
      en: "Privileges, control flow, memory bytes, and CPU targets form the core of this chapter.",
    },
  },
  {
    id: "m1",
    parentId: "center",
    title: "权限基础",
    englishTitle: "Privileges",
    level: 1,
    category: "privilege",
    icon: "KeyRound",
    side: "left",
    summary: "理解进程、文件、root 和高权限命令的身份基础。",
  },
  {
    id: "m1-1",
    parentId: "m1",
    title: "进程与文件的身份",
    level: 2,
    category: "privilege",
    summary: "Linux 使用 UID/GID 描述进程身份，并用所有者与组描述文件归属。",
    bullets: [
      "每个进程都有用户 ID 和组 ID。",
      "Every process has a User ID (UID) and a Group ID (GID).",
      "每个文件和目录都属于某个用户和某个组。",
      "Every file and directory is owned by a user and a group.",
      "子进程会继承父进程的身份。",
      "Child processes inherit identity from parent processes.",
    ],
  },
  {
    id: "m1-2",
    parentId: "m1",
    title: "Root 用户",
    level: 2,
    category: "privilege",
    summary: "Linux 中 UID 0 是 root，拥有极高系统权限。",
    bullets: [
      "Linux 中 UID 0 是 root。",
      "In Linux, UID 0 is root.",
      "root 可用于安装软件、加载驱动、重启系统等。",
      "Root is used for installing software, loading drivers, rebooting, and other privileged operations.",
    ],
    importantSentence: {
      en: "As root, you can do anything.",
      zh: "作为 root，几乎可以做任何事情。",
    },
  },
  {
    id: "m1-3",
    parentId: "m1",
    title: "如何以 root 权限运行命令",
    level: 2,
    category: "privilege",
    summary: "运行高权限命令通常需要权限提升机制。",
    bullets: [
      "常见方式包括 sudo、su、newgrp、SUID 程序等。",
      "本章重点关注 SUID 程序和漏洞导致的权限提升。",
    ],
  },
  {
    id: "m2",
    parentId: "center",
    title: "特殊权限位",
    englishTitle: "Special Permission Bits",
    level: 1,
    category: "privilege",
    icon: "ShieldCheck",
    side: "left",
    summary: "SUID、SGID 与 Sticky Bit 会改变程序或目录的权限行为。",
  },
  {
    id: "m2-1",
    parentId: "m2",
    title: "SUID / Set User ID",
    level: 2,
    category: "privilege",
    summary: "SUID 让程序运行时使用文件所有者的有效用户 ID。",
    bullets: [
      "SUID: execute with the effective UID (eUID) of the file owner rather than the parent process.",
      "如果 root 拥有的程序设置了 SUID，普通用户运行它时，该程序可能以 root 的 eUID 运行。",
      "SUID 程序如果存在漏洞，可能导致严重权限提升。",
    ],
  },
  {
    id: "m2-2",
    parentId: "m2",
    title: "SGID / Set Group ID",
    level: 2,
    category: "privilege",
    summary: "SGID 让程序运行时使用文件所属组的有效组 ID。",
    bullets: [
      "SGID: execute with the effective GID (eGID) of the file owner/group rather than the parent process.",
      "SGID 影响组权限，而 SUID 影响用户权限。",
    ],
  },
  {
    id: "m2-3",
    parentId: "m2",
    title: "Sticky Bit",
    level: 2,
    category: "privilege",
    summary: "Sticky Bit 常用于共享目录，限制文件删除。",
    bullets: [
      "Sticky: used for shared directories to limit file removal to file owners.",
      "典型例子是 /tmp：多人可写，但不能随便删除别人文件。",
    ],
  },
  {
    id: "m2-4",
    parentId: "m2",
    title: "SUID 程序示例",
    level: 2,
    category: "privilege",
    summary: "sudo、su、newgrp 需要临时获得较高权限，因此必须谨慎设计。",
    bullets: ["sudo", "su", "newgrp", "这些程序一旦存在漏洞，影响会比普通程序更大。"],
  },
  {
    id: "m3",
    parentId: "center",
    title: "Real / Effective / Saved UID 与 GID",
    level: 1,
    category: "privilege",
    icon: "Fingerprint",
    side: "left",
    summary: "区分真实身份、权限检查身份和可恢复身份。",
  },
  {
    id: "m3-1",
    parentId: "m3",
    title: "Effective UID / eUID",
    level: 2,
    category: "privilege",
    summary: "Effective UID 是大多数权限检查使用的 UID。",
    bullets: [
      "Effective UID: the UID used for most access checks.",
      "系统判断进程能否读写文件、执行敏感操作时，主要看 eUID/eGID。",
      "对 SUID 程序而言，eUID 可能不同于真实用户。",
    ],
  },
  {
    id: "m3-2",
    parentId: "m3",
    title: "Real UID / rUID",
    level: 2,
    category: "privilege",
    summary: "Real UID 表示进程真实拥有者。",
    bullets: [
      "Real UID: the real UID of the process owner.",
      "rUID 常用于信号检查等场景。",
      "普通用户运行 SUID 程序时，rUID 仍然是普通用户。",
    ],
  },
  {
    id: "m3-3",
    parentId: "m3",
    title: "Saved UID",
    level: 2,
    category: "privilege",
    summary: "Saved UID 是进程可以切换回去的 UID。",
    bullets: [
      "Saved UID: a UID that the process could switch its eUID to.",
      "用于临时放弃权限，之后再恢复。",
      "Used for temporarily dropping privileges.",
    ],
  },
  {
    id: "m3-4",
    parentId: "m3",
    title: "三者关系总结",
    level: 2,
    category: "privilege",
    summary: "安全分析必须区分谁启动了进程，以及进程现在以什么权限运行。",
    bullets: ["rUID：真实身份。", "eUID：权限检查主要依据。", "saved UID：用于权限切换和恢复。"],
  },
  {
    id: "m4",
    parentId: "center",
    title: "权限提升",
    englishTitle: "Privilege Escalation",
    level: 1,
    category: "privilege",
    icon: "TrendingUp",
    side: "left",
    summary: "攻击者将自己的权限提升到 root 或更高权限的过程。",
  },
  {
    id: "m4-1",
    parentId: "m4",
    title: "定义",
    level: 2,
    category: "privilege",
    summary: "权限提升通常是入侵后的进一步扩大权限。",
    bullets: [
      "权限提升是一类攻击，攻击者将自己的权限提升到 root 或更高权限。",
      "Privilege escalation is a class of exploits where the attacker elevates their privilege to root.",
    ],
  },
  {
    id: "m4-2",
    parentId: "m4",
    title: "典型流程",
    level: 2,
    category: "privilege",
    summary: "先获得立足点，再寻找高权限目标，最后利用漏洞。",
    bullets: [
      "攻击者先通过其他方式获得立足点。",
      "Attacker gains a foothold through other means.",
      "找到有漏洞的高权限服务。",
      "Identify a vulnerable privileged service.",
      "利用漏洞获得更高权限。",
      "Exploit it to gain privilege.",
    ],
  },
  {
    id: "m4-3",
    parentId: "m4",
    title: "常见来源",
    level: 2,
    category: "privilege",
    summary: "SUID、sudo 滥用、容器默认 root 和内核漏洞都是常见风险来源。",
    bullets: [
      "SUID 程序漏洞。Vulnerabilities in SUID binaries.",
      "PPT 提到：几乎每年都会出现相关问题。",
      "不必要地使用 sudo。Unnecessary SUDOing.",
      "Containers：容器中默认 root 用户可能扩大风险。Docker's default user is root.",
      "OS-level vulnerabilities：操作系统或内核级漏洞。",
    ],
  },
  {
    id: "m4-4",
    parentId: "m4",
    title: "安全意义",
    level: 2,
    category: "privilege",
    summary: "高权限服务漏洞可能直接导致 root。",
    bullets: [
      "普通权限漏洞可能只影响当前用户。",
      "高权限服务漏洞可能直接导致 root。",
      "高权限程序的输入验证、权限最小化和隔离非常关键。",
    ],
  },
  {
    id: "m5",
    parentId: "center",
    title: "缓解方法",
    englishTitle: "Mitigation",
    level: 1,
    category: "defense",
    icon: "LockKeyhole",
    side: "left",
    summary: "通过最小权限、权限拆分、沙箱和高风险二进制保护降低危害。",
  },
  {
    id: "m5-1",
    parentId: "m5",
    title: "Capabilities",
    level: 2,
    category: "defense",
    summary: "Capabilities 是比完整 root 更细粒度的权限机制。",
    bullets: ["核心思想：最小权限原则。", "不要给程序完整 root 权限，只给它完成任务必需的能力。", "Principle of least privilege."],
  },
  {
    id: "m5-2",
    parentId: "m5",
    title: "保护常被劫持的程序",
    level: 2,
    category: "defense",
    summary: "Securing frequently hijacked binaries.",
    bullets: ["典型例子：/bin/sh。", "Shell 是攻击中常见目标，因此需要额外保护。"],
  },
  {
    id: "m5-3",
    parentId: "m5",
    title: "/bin/sh 的 SUID 保护行为",
    level: 2,
    category: "defense",
    summary: "SUID 方式运行时，/bin/sh 会尝试丢弃高权限。",
    bullets: [
      "如果 /bin/sh 以 SUID 方式运行，即 eUID == 0 但 rUID != 0，它会丢弃高权限。",
      "If /bin/sh is run as SUID, it will drop privileges to the rUID.",
      "也就是 eUID 会变成 rUID，避免普通用户直接获得 root shell。",
      "PPT 提到 sh -p 可禁用这种丢弃行为；页面只作为课程概念展示，不做可执行演示。",
    ],
  },
  {
    id: "m5-4",
    parentId: "m5",
    title: "高权限与低权限部分分离",
    level: 2,
    category: "defense",
    summary: "Separate privileged and unprivileged parts of program.",
    bullets: [
      "将程序中真正需要高权限的部分单独拆出来。",
      "示例：Wireshark 使用 dumpcap 负责抓包，主程序 wireshark 不需要整体高权限。",
      "Wireshark: dumpcap vs. wireshark.",
    ],
  },
  {
    id: "m5-5",
    parentId: "m5",
    title: "Sandboxing 沙箱",
    level: 2,
    category: "defense",
    summary: "Sandboxing 可以限制程序能访问的资源。",
    bullets: ["Usually reduces, but does not eliminate, the harm.", "沙箱通常可以降低危害，但不能完全消除风险。"],
  },
  {
    id: "m6",
    parentId: "center",
    title: "计算机体系结构",
    englishTitle: "Computer Architecture",
    level: 1,
    category: "architecture",
    icon: "Cpu",
    side: "left",
    summary: "从源代码到机器指令，再到 CPU 和内存执行模型。",
  },
  {
    id: "m6-1",
    parentId: "m6",
    title: "软件工程师视角",
    level: 2,
    category: "architecture",
    summary: "高级语言最终会落到二进制机器指令。",
    bullets: [
      "源代码 Source Code。",
      "中间语言或字节码 Intermediate Language / Bytecode。",
      "解释器或 JIT Interpreter or JIT。",
      "编译器 Compiler。",
      "二进制编码指令 Binary-encoded Instructions。",
      "CPU 执行机器指令。",
      "Source Code → Interpreter/JIT or Compiler → Binary-encoded Instructions → CPU.",
    ],
  },
  {
    id: "m6-2",
    parentId: "m6",
    title: "不同语言的执行路径",
    level: 2,
    category: "architecture",
    summary: "解释执行、JIT 和编译执行最终都要面对 CPU 机器指令。",
    bullets: [
      "Python / JavaScript / Java 可能通过解释器或 JIT 执行。",
      "C / C++ / Rust 通常通过编译器生成机器码。",
      "不管高级语言形式如何，最终 CPU 执行的是二进制机器指令。",
    ],
  },
  {
    id: "m6-3",
    parentId: "m6",
    title: "CPU 与外部组件",
    level: 2,
    category: "architecture",
    summary: "CPU 通过总线或桥接机制与 Memory、Disk、Network and Others 通信。",
    bullets: [
      "Memory：运行时存放代码和数据。",
      "Disk：长期保存文件和程序。",
      "Network and Others：输入输出来源。",
      "CPU 内部包括 Registers、Control Unit (CU)、Arithmetic Logic Unit (ALU)、Cache 等。",
    ],
  },
  {
    id: "m6-4",
    parentId: "m6",
    title: "Cache 与多核结构",
    level: 2,
    category: "architecture",
    summary: "Cache 用于加速 CPU 对内存数据的访问。",
    bullets: [
      "CPU 内部可包含 L1 Cache。",
      "多个核心可能共享 L2 Cache。",
      "PPT 图中展示了 Registers、CU、ALU、L1 Cache、L2 Cache 等结构。",
    ],
  },
  {
    id: "m6-5",
    parentId: "m6",
    title: "冯诺依曼结构 Von Neumann Architecture",
    level: 2,
    category: "architecture",
    summary: "代码和数据都存储在内存中。",
    bullets: [
      "Von Neumann Architecture。",
      "后续 Shellcode Injection 的基础来自这里。",
      "程序输入的数据如果被当成机器指令执行，就可能发生代码注入。",
    ],
  },
];

const rightModules: Omit<MindMapNodeData, "x" | "y" | "color">[] = [
  {
    id: "m7",
    parentId: "center",
    title: "二进制与汇编",
    englishTitle: "Binary and Assembly",
    level: 1,
    category: "assembly",
    icon: "Binary",
    side: "right",
    summary: "机器码是 CPU 实际执行的内容，汇编是其可读形式。",
  },
  {
    id: "m7-1",
    parentId: "m7",
    title: "Binary 二进制",
    level: 2,
    category: "assembly",
    summary: "CPU 直接执行二进制编码的机器指令。",
    bullets: ["Binary is what the CPU actually executes.", "高级语言代码最终会转化为 CPU 可执行的机器码。"],
  },
  {
    id: "m7-2",
    parentId: "m7",
    title: "Assembly 汇编",
    level: 2,
    category: "assembly",
    summary: "Assembly 是机器指令的人类可读形式。",
    bullets: ["Assembly is a human-readable representation of machine instructions.", "例如 push、mov、add、call、ret 等。", "PPT 中用 push rbp 等示例说明二进制和汇编之间的关系。"],
  },
  {
    id: "m7-3",
    parentId: "m7",
    title: "为什么安全课要学汇编",
    level: 2,
    category: "assembly",
    summary: "权限提升和 Shellcode 都涉及程序底层执行。",
    bullets: [
      "想理解漏洞利用，必须知道 CPU 如何读取指令、寄存器如何存值、栈如何保存返回地址。",
      "汇编是理解 Shellcode 的基础。",
    ],
  },
  {
    id: "m8",
    parentId: "center",
    title: "寄存器",
    englishTitle: "Registers",
    level: 1,
    category: "assembly",
    icon: "Microchip",
    side: "right",
    summary: "寄存器是 CPU 内部最快、最小、最临时的存储。",
  },
  {
    id: "m8-1",
    parentId: "m8",
    title: "定义",
    level: 2,
    category: "assembly",
    summary: "Registers are super fast, expensive, temporary memory.",
    bullets: ["寄存器是 CPU 内部非常快、容量小、临时性的存储空间。", "它们比内存快得多，但数量有限。"],
  },
  {
    id: "m8-2",
    parentId: "m8",
    title: "不同架构的寄存器",
    level: 2,
    category: "assembly",
    summary: "不同 CPU 架构有不同寄存器命名和宽度。",
    bullets: [
      "8085 8-bit: a, b, c, d, e, h, l.",
      "8086 16-bit: ax, bx, cx, dx, sp, bp, si, di.",
      "x86 32-bit: eax, ebx, ecx, edx, esp, ebp, esi, edi.",
      "amd64 64-bit: rax, rbx, rcx, rdx, rsp, rbp, rsi, rdi, r8-r15.",
      "ARM: r0, r1, r2, ..., r14.",
    ],
  },
  {
    id: "m8-3",
    parentId: "m8",
    title: "指令指针 Instruction Pointer",
    level: 2,
    category: "assembly",
    summary: "下一条指令的地址存放在寄存器中。",
    bullets: ["The address of the next instruction is in a register.", "x86: eip.", "amd64: rip.", "ARM: r15.", "如果攻击者能控制 instruction pointer，就可能改变程序执行流。"],
  },
  {
    id: "m8-4",
    parentId: "m8",
    title: "寄存器部分访问 Partial Access",
    level: 2,
    category: "assembly",
    summary: "寄存器可以部分访问，访问规则会影响高位。",
    bullets: [
      "Registers can be partially accessed.",
      "例如 rax 的低 32 位是 eax，低 16 位是 ax。",
      "Partial access preserves untouched parts of the register.",
      "例外：访问 eax 会把 rax 的高 32 位清零。",
      "Except eax: accessing eax will zero out the rest of rax.",
    ],
  },
  {
    id: "m9",
    parentId: "center",
    title: "汇编指令",
    englishTitle: "Instructions",
    level: 1,
    category: "assembly",
    icon: "Code2",
    side: "right",
    summary: "指令由操作码和操作数组成，可处理数据或改变控制流。",
  },
  {
    id: "m9-1",
    parentId: "m9",
    title: "指令基本格式",
    level: 2,
    category: "assembly",
    summary: "OPCODE OPERAND1, OPERAND2, ...",
    bullets: ["OPCODE 表示操作码，OPERAND 表示操作数。", "示例：mov rax, rbx；add rax, rbx；inc rax。"],
  },
  {
    id: "m9-2",
    parentId: "m9",
    title: "数据操作 Data Manipulation",
    level: 2,
    category: "assembly",
    summary: "mov、add、mul、inc 等指令用于移动和计算数据。",
    bullets: [
      "mov rax, rbx：把 rbx 的值移动/复制到 rax。",
      "mov rax, [rbx+4]：访问内存地址 rbx+4 处的数据。",
      "add rax, rbx：加法。mul rsi：乘法。",
      "inc rax：寄存器值加 1。inc [rax]：内存地址 rax 指向的位置中的值加 1。",
      "中括号 [] 在 Intel 语法中表示内存访问。",
    ],
  },
  {
    id: "m9-3",
    parentId: "m9",
    title: "控制流 Control Flow",
    level: 2,
    category: "assembly",
    summary: "控制流指令会改变程序接下来执行的位置。",
    bullets: ["无条件控制流 Unconditional：call, jmp, ret.", "条件控制流 Conditional：cmp rax, rbx；jb some_location."],
  },
  {
    id: "m9-4",
    parentId: "m9",
    title: "Flags Register 标志寄存器",
    level: 2,
    category: "assembly",
    summary: "条件跳转依赖 flags register。",
    bullets: [
      "Conditionals key off of the flags register.",
      "x86: eflags. amd64: rflags. ARM: aspr.",
      "flags 会被算术操作更新。",
      "cmp 本质上类似 subtraction，用于比较。",
      "test 本质上类似 and，用于按位测试。",
    ],
  },
  {
    id: "m10",
    parentId: "center",
    title: "Intel 语法与 AT&T 语法",
    level: 1,
    category: "assembly",
    icon: "Braces",
    side: "right",
    summary: "两种语法的操作数方向相反，做题时必须注意。",
  },
  {
    id: "m10-1",
    parentId: "m10",
    title: "Intel Syntax",
    level: 2,
    category: "assembly",
    summary: "Intel Syntax: OPCODE Dest, Src.",
    bullets: ["目标操作数在前，源操作数在后。", "mov rax, rbx 含义：rax = rbx。"],
  },
  {
    id: "m10-2",
    parentId: "m10",
    title: "AT&T Syntax",
    level: 2,
    category: "assembly",
    summary: "AT&T Syntax: OPCODE Src, Dest.",
    bullets: ["源操作数在前，目标操作数在后。", "mov %rbx, %rax 含义：rax = rbx。"],
  },
  {
    id: "m10-3",
    parentId: "m10",
    title: "学习提醒",
    level: 2,
    category: "assembly",
    summary: "本章 PPT 示例主要接近 Intel syntax。",
    bullets: ["做题时必须注意操作数方向。", "Intel: Dest, Src.", "AT&T: Src, Dest."],
  },
  {
    id: "m11",
    parentId: "center",
    title: "系统调用",
    englishTitle: "System Calls",
    level: 1,
    category: "syscall",
    icon: "TerminalSquare",
    side: "right",
    summary: "用户程序通过系统调用请求操作系统服务。",
  },
  {
    id: "m11-1",
    parentId: "m11",
    title: "定义",
    level: 2,
    category: "syscall",
    summary: "System calls 是用户程序请求操作系统服务的接口。",
    bullets: ["System calls are the interface between user programs and the operating system.", "程序不能直接执行所有敏感操作，需要通过系统调用让内核完成。"],
  },
  {
    id: "m11-2",
    parentId: "m11",
    title: "amd64 系统调用步骤",
    level: 2,
    category: "syscall",
    summary: "rax 放系统调用号，参数放寄存器，最后执行 syscall。",
    bullets: [
      "Set rax to the system call number.",
      "Store arguments in rdi, rsi, etc.",
      "Call the syscall instruction.",
      "中文：将系统调用号放入 rax；将参数放入 rdi、rsi 等寄存器；执行 syscall 指令。",
    ],
  },
  {
    id: "m11-3",
    parentId: "m11",
    title: "strace",
    level: 2,
    category: "syscall",
    summary: "可以使用 strace 跟踪一个进程调用了哪些系统调用。",
    bullets: ["We can trace process system calls using strace.", "strace 是理解程序和操作系统交互的重要工具。"],
  },
  {
    id: "m11-4",
    parentId: "m11",
    title: "系统调用数量",
    level: 2,
    category: "syscall",
    summary: "Linux 有 300 多个系统调用。",
    bullets: ["There are over 300 system calls."],
  },
  {
    id: "m11-5",
    parentId: "m11",
    title: "常见系统调用",
    level: 2,
    category: "syscall",
    summary: "open、read、write、fork、execve、wait 构成基本程序与系统交互。",
    bullets: [
      "open(const char *pathname, int flags)：打开文件，返回 file descriptor；也会出现在 /proc/self/fd 中。",
      "read(int fd, void *buf, size_t count)：从文件描述符读取数据。",
      "write(int fd, void *buf, size_t count)：向文件描述符写入数据。",
      "fork()：创建几乎相同的子进程；子进程返回 0，父进程返回子进程 PID。",
      "execve(const char *filename, char **argv, char **envp)：替换当前进程；exec never returns if successful.",
      "wait(int *wstatus)：等待子进程结束，返回子进程 PID，并把状态写入 wstatus。",
    ],
  },
  {
    id: "m11-6",
    parentId: "m11",
    title: "fork / exec / wait 关系",
    level: 2,
    category: "syscall",
    summary: "fork 创建，exec 替换，wait 等待。",
    bullets: ["fork 创建子进程。", "父进程通常 waitpid 等待子进程。", "子进程通常 execve 变成另一个程序。", "如果 execve 成功，它不会返回；如果失败，才会继续执行后面的错误处理。"],
  },
];

const moreRightModules: Omit<MindMapNodeData, "x" | "y" | "color">[] = [
  {
    id: "m12",
    parentId: "center",
    title: "调用约定",
    englishTitle: "Calling Convention",
    level: 1,
    category: "syscall",
    icon: "Network",
    side: "right",
    summary: "调用约定规定参数、返回值和寄存器保护规则。",
  },
  {
    id: "m12-1",
    parentId: "m12",
    title: "调用约定解决的问题",
    level: 2,
    category: "syscall",
    summary: "How can callee and caller functions pass arguments?",
    bullets: ["调用约定规定调用者和被调用者如何传递参数、返回值，以及哪些寄存器需要保护。", "Calling conventions define how functions pass arguments and return values."],
  },
  {
    id: "m12-2",
    parentId: "m12",
    title: "Linux x86",
    level: 2,
    category: "syscall",
    summary: "参数逆序压栈，返回值放在 eax。",
    bullets: ["push arguments in reverse order.", "call 指令会压入返回地址。", "return value in eax."],
  },
  {
    id: "m12-3",
    parentId: "m12",
    title: "Linux amd64",
    level: 2,
    category: "syscall",
    summary: "参数常放在 rdi, rsi, rdx, rcx, r8, r9，返回值放 rax。",
    bullets: ["这也是理解函数调用和系统调用的重要基础。"],
  },
  {
    id: "m12-4",
    parentId: "m12",
    title: "Linux ARM",
    level: 2,
    category: "syscall",
    summary: "参数放 r0, r1, r2, r3，返回值放 r0。",
  },
  {
    id: "m12-5",
    parentId: "m12",
    title: "Callee-saved Registers",
    level: 2,
    category: "syscall",
    summary: "寄存器在函数之间共享，因此调用约定要规定哪些寄存器必须保护。",
    bullets: ["Linux amd64 中：rbx, rbp, r12, r13, r14, r15 are callee-saved.", "callee-saved 表示被调用函数如果使用这些寄存器，返回前必须恢复。"],
  },
  {
    id: "m13",
    parentId: "center",
    title: "进程内存布局",
    englishTitle: "Process Memory Layout",
    level: 1,
    category: "memory",
    icon: "LayoutTemplate",
    side: "right",
    summary: "理解 .text、.data、.bss、heap、stack 和 Env 的位置与用途。",
  },
  { id: "m13-1", parentId: "m13", title: ".text", level: 2, category: "memory", summary: ".text: Machine code of executable.", bullets: [".text 段存放可执行文件的机器代码。"] },
  { id: "m13-2", parentId: "m13", title: ".data", level: 2, category: "memory", summary: ".data: Global initialized variables.", bullets: [".data 段存放已初始化的全局变量。"] },
  { id: "m13-3", parentId: "m13", title: ".bss", level: 2, category: "memory", summary: ".bss: global uninitialized variables.", bullets: [".bss 段存放未初始化的全局变量。", "PPT 中写作 Below Stack Section，但学习时重点记住它存放未初始化全局变量。"] },
  { id: "m13-4", parentId: "m13", title: "heap", level: 2, category: "memory", summary: "heap: Dynamic variables.", bullets: ["堆存放动态分配的变量。", "例如 malloc / new 申请的内存通常来自 heap。", "heap 通常向高地址增长。"] },
  { id: "m13-5", parentId: "m13", title: "stack", level: 2, category: "memory", summary: "stack: Local variables, function call data.", bullets: ["栈存放局部变量和函数调用数据。", "函数调用、返回地址、旧 rbp 等信息都和栈有关。", "stack 通常向低地址增长。"] },
  { id: "m13-6", parentId: "m13", title: "Env", level: 2, category: "memory", summary: "Env: Environment variables, program arguments.", bullets: ["Env 存放环境变量和程序参数。", "例如命令行参数 argv、环境变量 envp。"] },
  {
    id: "m13-7",
    parentId: "m13",
    title: "整体布局",
    level: 2,
    category: "memory",
    summary: "低地址到高地址大致：.text → .data → .bss → heap → unused → stack → Env.",
    bullets: ["heap grows upward.", "stack grows downward.", "这个布局有助于理解栈溢出、堆漏洞和 shellcode 位置。"],
  },
  {
    id: "m14",
    parentId: "center",
    title: "栈",
    englishTitle: "Stack",
    level: 1,
    category: "memory",
    icon: "Layers3",
    side: "right",
    summary: "栈保存局部变量、返回地址和函数调用数据。",
  },
  { id: "m14-1", parentId: "m14", title: "定义", level: 2, category: "memory", summary: "The stack is local storage.", bullets: ["Good place to keep data that does not fit into registers.", "当数据放不进寄存器，或者函数需要局部变量时，常用栈。"] },
  { id: "m14-2", parentId: "m14", title: "增长方向", level: 2, category: "memory", summary: "The stack grows from high addresses towards low addresses.", bullets: ["push 会让 rsp 变小；pop 会让 rsp 变大。"] },
  { id: "m14-3", parentId: "m14", title: "rsp 与 rbp", level: 2, category: "memory", summary: "rsp 是栈顶指针，rbp 常作为当前栈帧基准。", bullets: ["rsp: stack pointer，指向当前栈顶。", "rbp: base pointer，常用于标记当前栈帧基准位置。", "rsp 会频繁变化，rbp 常用于稳定访问局部变量和参数。"] },
  {
    id: "m15",
    parentId: "center",
    title: "数据类型与字节序",
    englishTitle: "Data Types / Endianness",
    level: 1,
    category: "memory",
    icon: "Blocks",
    side: "right",
    summary: "x86/amd64 使用小端序，调试时字节顺序很关键。",
  },
  { id: "m15-1", parentId: "m15", title: "Little-endian", level: 2, category: "memory", summary: "x86/amd64 are little-endian architecture.", bullets: ["小端序含义：低位字节放在低地址。", "数值 0xdeadbeef 在内存中可能显示为：ef be ad de."] },
  { id: "m15-2", parentId: "m15", title: "为什么有小端序", level: 2, category: "memory", summary: "学习重点：调试内存时看到的字节顺序可能和数值书写顺序相反。", bullets: ["历史性能 Performance (historical).", "方便不同大小的数据寻址 Ease of addressing for different sizes.", "8086 compatibility."] },
  {
    id: "m16",
    parentId: "center",
    title: "栈相关指令",
    englishTitle: "Stack / Frame Instructions",
    level: 1,
    category: "memory",
    icon: "Archive",
    side: "right",
    summary: "push、pop、leave 直接改变栈和栈帧。",
  },
  { id: "m16-1", parentId: "m16", title: "push", level: 2, category: "memory", summary: "push puts a value on the stack.", bullets: ["在 amd64 中：rsp = rsp - 8；[rsp] = rax。", "PPT 示例：rax = 7，push rax 后 rsp 从 N 变成 N-8，栈顶存入 7。"] },
  { id: "m16-2", parentId: "m16", title: "pop", level: 2, category: "memory", summary: "pop takes a value from the stack.", bullets: ["在 amd64 中：rax = [rsp]；rsp = rsp + 8。", "PPT 示例：pop rax 后，栈顶值进入 rax，rsp 从 N 变成 N+8。"] },
  { id: "m16-3", parentId: "m16", title: "leave", level: 2, category: "memory", summary: "leave 用于销毁当前函数栈帧。", bullets: ["Equivalent to: mov rsp, rbp; pop rbp.", "先把 rbp 复制给 rsp，再从栈中恢复旧 rbp。", "常与 ret 一起出现在函数结尾。"] },
  {
    id: "m17",
    parentId: "center",
    title: "控制流指令",
    englishTitle: "Control Flow Instructions",
    level: 1,
    category: "assembly",
    icon: "Waypoints",
    side: "right",
    summary: "jmp、call、ret 会改变程序下一步执行位置。",
  },
  { id: "m17-1", parentId: "m17", title: "jmp", level: 2, category: "assembly", summary: "jmp 改变 instruction pointer。", bullets: ["rip points to the currently executing instruction in the .text section.", "jmp 有无条件和条件形式。Has unconditional and conditional forms.", "Uses relative addressing.", "PPT 示例：jmp -20 会让 rip 跳到相对当前位置偏移 -20 的地方。"] },
  { id: "m17-2", parentId: "m17", title: "call", level: 2, category: "assembly", summary: "call 用于函数调用。", bullets: ["Saves the current instruction pointer to the stack.", "Jumps to the argument value.", "call 会把返回地址压入栈，然后跳转到目标函数。", "这解释了为什么函数执行完后能知道回到哪里。"] },
  { id: "m17-3", parentId: "m17", title: "ret", level: 2, category: "assembly", summary: "ret 用于函数返回。", bullets: ["Pops the stack into the instruction pointer.", "ret 从栈顶弹出返回地址，并把它放入 instruction pointer。", "如果攻击者能篡改栈上的返回地址，就可能改变程序控制流。", "页面只做概念说明，不提供攻击演示。"] },
  {
    id: "m18",
    parentId: "center",
    title: "函数调用例子",
    englishTitle: "Functional Call Example",
    level: 1,
    category: "memory",
    icon: "FunctionSquare",
    side: "right",
    summary: "用 C 函数、汇编、参数和栈帧串起函数调用过程。",
  },
  { id: "m18-1", parentId: "m18", title: "C 代码结构", level: 2, category: "memory", summary: "PPT 中展示了 bar 和 foo 的函数调用例子。", bullets: ["bar(int arg1, int arg2, int arg3) 返回 0。", "foo() 中：local_var = bar(1, 2, 3)；local_var += 5；return local_var."] },
  { id: "m18-2", parentId: "m18", title: "汇编中的函数序言 Prologue", level: 2, category: "memory", summary: "常见函数开头：push rbp; mov rbp, rsp; sub rsp, 16.", bullets: ["保存旧 rbp；建立新的栈帧；给局部变量留出空间。"] },
  { id: "m18-3", parentId: "m18", title: "参数传递", level: 2, category: "memory", summary: "在 amd64 中，bar(1, 2, 3) 的参数通常放入 edi=1、esi=2、edx=3。", bullets: ["然后执行 call bar。", "这体现了 calling convention。"] },
  { id: "m18-4", parentId: "m18", title: "局部变量与返回", level: 2, category: "memory", summary: "返回值通常放在 eax/rax。", bullets: ["local_var 可以存放在 [rbp-4] 等栈帧位置。", "函数结束时使用 leave 和 ret。", "整个过程体现：C 函数 → 汇编指令 → 栈变化 → 返回地址恢复。"] },
];

const shellcodeModules: Omit<MindMapNodeData, "x" | "y" | "color">[] = [
  {
    id: "m19",
    parentId: "center",
    title: "冯诺依曼结构与 Shellcode Injection",
    level: 1,
    category: "shellcode",
    icon: "Bug",
    side: "right",
    summary: "代码和数据同在内存中，数据在某些情况下可能被当成代码执行。",
  },
  { id: "m19-1", parentId: "m19", title: "关键思想", level: 2, category: "shellcode", summary: "No separation between code and data.", bullets: ["代码和数据没有天然分离。", "Code can be passed on as data and vice versa.", "代码可以作为数据传递，数据在某些情况下也可能被当成代码执行。"] },
  { id: "m19-2", parentId: "m19", title: "Shellcode Injection 的基础", level: 2, category: "shellcode", summary: "如果攻击者能把机器码字节写入内存，并让 CPU 跳转过去执行，那么输入数据就可能变成代码。", bullets: ["这正是本章从权限、体系结构、寄存器、栈一路讲到 Shellcode 的原因。"] },
  {
    id: "m20",
    parentId: "center",
    title: "Shellcode 核心概念",
    level: 1,
    category: "shellcode",
    icon: "FileCode2",
    side: "right",
    summary: "Shellcode 是可直接执行的机器码片段，运行在目标程序上下文中。",
  },
  { id: "m20-1", parentId: "m20", title: "定义", level: 2, category: "shellcode", summary: "Shellcode 是一段可直接执行的机器码片段。", bullets: ["Shellcode is a piece of binary code that can be executed directly.", "传统 shellcode 常用于启动 shell，但它不一定只能启动 shell。"] },
  { id: "m20-2", parentId: "m20", title: "攻击者目标", level: 2, category: "shellcode", summary: "Attacker goal: arbitrary shell code execution.", bullets: ["攻击者目标是让程序执行任意 shellcode。", "Inject binary code that runs in the context of the program.", "注入二进制代码，使其在目标程序上下文中运行。"] },
  { id: "m20-3", parentId: "m20", title: "上下文 Context", level: 2, category: "shellcode", summary: "Shellcode 运行在目标程序的上下文中。", bullets: ["如果目标程序是普通权限，shellcode 也是普通权限。", "如果目标程序是高权限，例如 SUID root 程序，则后果可能更严重。", "这就是 Shellcode 与权限提升之间的联系。"] },
  { id: "m20-4", parentId: "m20", title: "常见示例 execve", level: 2, category: "shellcode", summary: "PPT 示例：execve(\"/bin/sh\", NULL, NULL)。", bullets: ["含义：用 /bin/sh 替换当前进程，启动 shell。", "execve replaces your process.", "也可以有其他目标，例如 CTF 中读取 flag。", "You can have other targeted goals, e.g., reading a flag in a CTF."] },
  {
    id: "m21",
    parentId: "center",
    title: "Shellcode 汇编示例的含义",
    level: 1,
    category: "shellcode",
    icon: "ScanLine",
    side: "right",
    summary: "只展示课程概念，不提供运行 shellcode 或攻击功能。",
  },
  { id: "m21-1", parentId: "m21", title: "系统调用号", level: 2, category: "shellcode", summary: "mov rax, 59。", bullets: ["rax 放系统调用号。", "在 PPT 示例中，59 是 execve 的 syscall number。"] },
  { id: "m21-2", parentId: "m21", title: "第一个参数 filename", level: 2, category: "shellcode", summary: "lea rdi, [rip+binsh]。", bullets: ["rdi 指向字符串 \"/bin/sh\"。", "rip-relative addressing 用于找到 binsh 标签所在位置。"] },
  { id: "m21-3", parentId: "m21", title: "第二个参数 argv", level: 2, category: "shellcode", summary: "mov rsi, 0。", bullets: ["rsi = NULL。", "表示 argv 参数为空。"] },
  { id: "m21-4", parentId: "m21", title: "第三个参数 envp", level: 2, category: "shellcode", summary: "mov rdx, 0。", bullets: ["rdx = NULL。", "表示 envp 参数为空。"] },
  { id: "m21-5", parentId: "m21", title: "触发系统调用", level: 2, category: "shellcode", summary: "syscall。", bullets: ["触发系统调用，让内核执行 execve。", "syscall instruction transfers control to the kernel."] },
  { id: "m21-6", parentId: "m21", title: "字符串标签", level: 2, category: "shellcode", summary: "binsh: .string \"/bin/sh\"。", bullets: ["binsh 是一个标签，标记字符串 \"/bin/sh\" 的位置。", "lea rdi, [rip+binsh] 会让 rdi 指向该字符串。"] },
  {
    id: "m22",
    parentId: "center",
    title: "如何构造 Shellcode",
    englishTitle: "How to Build Shellcode",
    level: 1,
    category: "shellcode",
    icon: "Hammer",
    side: "right",
    summary: "仅用于展示 PPT 中的学习流程，不实现真实攻击或执行功能。",
  },
  { id: "m22-1", parentId: "m22", title: "写汇编", level: 2, category: "shellcode", summary: "Write your shellcode as assembly.", bullets: ["先写汇编代码。", "使用 .global _start、_start 标签、.intel_syntax noprefix 等形式组织代码。"] },
  { id: "m22-2", parentId: "m22", title: "汇编成 ELF", level: 2, category: "shellcode", summary: "Then, assemble it.", bullets: ["PPT 示例命令：gcc -nostdlib -static shellcode.s -o shellcode-elf。", "含义：把汇编文件构造成一个静态 ELF 可执行文件。", "页面中只显示为课程命令示例，不提供执行环境。"] },
  { id: "m22-3", parentId: "m22", title: "提取 .text", level: 2, category: "shellcode", summary: "The ELF contains shellcode as its .text.", bullets: ["还需要提取 .text 段。", "PPT 示例命令：objcopy --dump-section .text=shellcode-raw shellcode-elf。", "shellcode-raw 包含 shellcode 原始字节。", "The resulting shellcode-raw file contains the raw bytes of your shellcode."] },
  { id: "m22-4", parentId: "m22", title: "调试工具", level: 2, category: "shellcode", summary: "Debug using strace and gdb.", bullets: ["可以直接运行 ELF 文件进行观察。", "strace：观察系统调用。", "gdb：调试寄存器、内存、指令流。"] },
  {
    id: "m23",
    parentId: "center",
    title: "数据执行保护",
    englishTitle: "Data Execution Prevention",
    level: 1,
    category: "defense",
    icon: "ShieldAlert",
    side: "right",
    summary: "现代系统用 DEP/NX/W^X 降低数据被当成代码执行的风险。",
  },
  { id: "m23-1", parentId: "m23", title: "现代内存权限", level: 2, category: "defense", summary: "Modern architectures support memory permissions.", bullets: ["PROT_READ：允许进程读取内存。", "PROT_WRITE：允许进程写入内存。", "PROT_EXEC：允许进程执行内存中的代码。"] },
  { id: "m23-2", parentId: "m23", title: "DEP / NX", level: 2, category: "defense", summary: "Data Execution Prevention / DEP。", bullets: ["DEP 的思想：数据区域不应该被当成代码执行。", "NX bit / Non-Executable memory。", "例如栈和堆可以写，但通常不应该可执行。"] },
  { id: "m23-3", parentId: "m23", title: "W^X", level: 2, category: "defense", summary: "W^X means Write XOR Execute.", bullets: ["一块内存不应该同时可写又可执行。", "如果内存可写，就不应可执行；如果内存可执行，就不应可写。", "这降低了 shellcode injection 的成功率。"] },
  {
    id: "m24",
    parentId: "center",
    title: "Shellcode Injection 的现实情况",
    level: 1,
    category: "defense",
    icon: "Activity",
    side: "right",
    summary: "传统 shellcode 注入在现代系统更少见，但某些场景仍需警惕。",
  },
  { id: "m24-1", parentId: "m24", title: "现实中更少见", level: 2, category: "defense", summary: "Shellcode injection is now much rarer in real life.", bullets: ["原因包括：DEP / NX、ASLR、Stack Canary、W^X、Sandboxing、权限分离。"] },
  { id: "m24-2", parentId: "m24", title: "嵌入式设备", level: 2, category: "defense", summary: "Still viable in many embedded devices.", bullets: ["原因可能包括：系统老旧、防御机制不完整、更新困难、固件安全较弱。"] },
  { id: "m24-3", parentId: "m24", title: "仍可能出现的场景", level: 2, category: "defense", summary: "mprotect(PROT_EXEC) system call.", bullets: ["程序可能通过 mprotect 修改内存权限，使内存变成可执行。", "JIT compilers, e.g., JavaScript.", "JIT 编译器需要运行时生成机器码，因此会涉及可执行内存。", "这使得现代系统仍需谨慎处理可写/可执行内存。"] },
  {
    id: "m25",
    parentId: "center",
    title: "本章学习主线总结",
    level: 1,
    category: "summary",
    icon: "BookOpenCheck",
    side: "right",
    summary: "从权限到提权，从体系结构到 Shellcode，从攻击理解到防御。",
  },
  { id: "m25-1", parentId: "m25", title: "从权限到提权", level: 2, category: "summary", summary: "Linux 用 UID/GID 管理进程和文件权限。", bullets: ["SUID/SGID 等特殊权限位允许程序临时拥有不同身份。", "如果高权限程序有漏洞，攻击者可能完成权限提升。"] },
  { id: "m25-2", parentId: "m25", title: "从体系结构到 Shellcode", level: 2, category: "summary", summary: "CPU 执行二进制机器指令。", bullets: ["汇编是机器指令的人类可读形式。", "寄存器、栈、系统调用和调用约定共同决定程序如何运行。", "冯诺依曼结构中代码和数据都在内存中，这为 shellcode injection 提供了基础。"] },
  { id: "m25-3", parentId: "m25", title: "从攻击理解到防御", level: 2, category: "summary", summary: "Shellcode injection 的关键是：控制内存中的字节 + 控制 CPU 跳转位置。", bullets: ["现代防御通过 DEP、NX、W^X、沙箱、权限拆分等方式降低风险。", "但在嵌入式设备、JIT、mprotect 等场景中仍需警惕。"] },
];

const nodesWithoutPositions = [...rawNodes, ...rightModules, ...moreRightModules, ...shellcodeModules];

const leftModuleIds = nodesWithoutPositions
  .filter((node) => node.level === 1 && node.side === "left")
  .map((node) => node.id);
const rightModuleIds = nodesWithoutPositions
  .filter((node) => node.level === 1 && node.side === "right")
  .map((node) => node.id);

const modulePositions = new Map<string, { x: number; y: number; side: "left" | "right" }>();
leftModuleIds.forEach((id, index) => {
  modulePositions.set(id, { x: -780, y: -980 + index * 360, side: "left" });
});
rightModuleIds.forEach((id, index) => {
  modulePositions.set(id, { x: 780, y: -3360 + index * 360, side: "right" });
});

const childrenByParent = new Map<string, Omit<MindMapNodeData, "x" | "y" | "color">[]>();
nodesWithoutPositions.forEach((node) => {
  if (!node.parentId || node.level !== 2) return;
  const current = childrenByParent.get(node.parentId) ?? [];
  current.push(node);
  childrenByParent.set(node.parentId, current);
});

export const securityMindmapNodes: MindMapNodeData[] = nodesWithoutPositions.map((node) => {
  if (node.id === "center") {
    return { ...node, x: 0, y: 0, color: categoryMeta[node.category].color };
  }

  if (node.level === 1) {
    const position = modulePositions.get(node.id) ?? { x: 0, y: 0 };
    return { ...node, x: position.x, y: position.y, color: categoryMeta[node.category].color };
  }

  const parentPosition = modulePositions.get(node.parentId ?? "");
  const siblings = childrenByParent.get(node.parentId ?? "") ?? [];
  const index = siblings.findIndex((item) => item.id === node.id);
  const side = parentPosition?.side ?? "right";
  const siblingOffset = (index - (siblings.length - 1) / 2) * 128;
  return {
    ...node,
    x: (parentPosition?.x ?? 0) + (side === "left" ? -560 : 560),
    y: (parentPosition?.y ?? 0) + siblingOffset,
    color: categoryMeta[node.category].color,
    side,
  };
});

export const securityMindmapEdges = securityMindmapNodes
  .filter((node) => node.parentId)
  .map((node) => ({
    id: `${node.parentId}-${node.id}`,
    source: node.parentId as string,
    target: node.id,
  }));

export const securityMindmapNodeMap = new Map(
  securityMindmapNodes.map((node) => [node.id, node])
);

export const bottomSummary = {
  title: "一句话总结",
  content:
    "如果攻击者既能控制进入内存的字节，又能控制 CPU 跳转位置，那么数据就可能被当成代码执行；如果这个程序还拥有高权限，就可能进一步造成权限提升。",
};
