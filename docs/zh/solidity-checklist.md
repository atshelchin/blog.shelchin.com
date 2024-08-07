# Solidity 语法掌握检查清单

Solidity 是以太坊智能合约的编程语言，具有独特的语法和特性。

以下是一份详细的Solidity语法掌握检查清单：

## 1. 常量、变量、不可变变量

- **常量**：编译时确定的值，不可修改。
- **变量**：运行时可以修改的值。
- **不可变变量**：在构造函数中赋值一次，之后不可修改。

## 2. 数据类型

### 2.1 值类型

- `uint256`：无符号整数，常用于计数和货币相关操作。
- `bool`：布尔值，表示逻辑真或假。
- `enum`：枚举类型，用于创建具有限定值集合的自定义类型。
- `address`：用于存储以太坊地址。
- `bytes32`：固定大小的字节数组，常用于存储哈希值。

### 2.2 引用类型

- `string`：动态大小的 UTF-8 编码字符串。
- `bytes`：动态大小的字节序列。
- `struct`：结构体，用于定义新的数据类型。
- `mapping`：映射类型，类似于哈希表或字典。
- `数组`：可以是固定大小或动态大小。

## 3. 基础操作

### 3.1 安全的数字计算

- 防止整数溢出和下溢。

### 3.2 变量比较

- 直接比较值类型变量。
- 将 `bytes` 和 `string` 类型转为 `bytes32` 进行比较。

### 3.3 错误处理

- 使用 `revert` 进行错误处理和状态回滚。

### 3.4 方法调用

- 调用当前合约、父合约、库和外部合约中的方法。

## 4. 控制结构

- `if-else`：条件分支。
- `for` 循环：迭代循环。

## 5. OOP 在Solidity 中的体现

- 继承、接口实现、构造函数、封装、函数重载和抽象合约。

## 6. Solidity 常用内置变量

- `msg.sender`
- `msg.value`
- `block.timestamp` 
- ...

## 7. Solidity 常用内置功能函数

- `keccak256`
- `abi.encode`
- `abi.decode` 
- ...

## 8. Solidity 几个特殊方法

- `receive`
- `fallback`
- `selfdestruct`
- `constructor`

## 9. 常见的几种用法

- 自定义函数修饰符
- 事件的使用
- 使合约能接受以太币
- 提取合约中的以太币

## 10. 难点

### 10.1 理解委托调用
  - 被调用合约可以访问和修改调用者合约的状态变量
### 10.2 理解存储布局
  - 状态变量按照它们在代码中声明的顺序存储。
  - 每个槽可以存储256位数据，对于小于256位的状态变量，Solidity会尽量将多个变量打包到同一个存储槽中。
  - 引用类型使用单独的槽来存储数据位置的指针。
### 10.3 理解EVM的执行模型

  -  栈式机制：操作指令通常涉及从栈顶取出元素，执行操作，并将结果推回栈顶
  -  内存布局

     - 存储（Storage）：
       - 永久存储在区块链上的数据。
       - 每个存储槽可以存储256位。
       - 直接通过槽位地址和`storage`关键字在汇编中访问。
     - 内存（Memory）：
       - 临时存储，只在交易执行期间存在。
       - 通过`mstore`、`mload`等汇编指令访问。
       - 内存是线性的，按需扩展，但增加内存大小会增加gas成本。
     - 栈（Stack）：
       - 用于存储方法调用和运算的参数和局部变量。
       - 在Solidity内联汇编中，可以通过操作栈顶数据来实现快速的数据存取。
  -  Gas 成本
     -  存储
     -  计算
### 10.4 熟悉内联汇编指令
  - 数据存储和加载

  - 算术运算

  - 比较和逻辑运算

  - 环境信息

  - 跳转和控制结构

  - 函数调用相关