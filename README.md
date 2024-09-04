前端脚手架

## 项目架构
### packages/core   
    - 核心包，里面主要处理command注册，全局上下文构建。
    - 使用esmodule规范编写，webpack做打包工作，打包为commonjs规范。
    - 提供start,build做本地测试。
### packages/commands
    - 脚手架指令
### packages/exec
    - 脚手架指令执行函数。
    - 通过使用Package类来注册包实现动态引入，利用import()来实现在commonjs中通过绝对路径导入包的功能（支持esmodule导入）
### packages/models
    - 模型层
    - 主要是Pacakge,Command等抽象模型层的编写
### package/utils
    - 常用工具方法
      - log  优化输出
      - get-npm-info    获取包的版本信息等
      - dynamic-require 抽离出来这个逻辑是为了利用webpack的externals配置来防止动态引入逻辑打包后报错失效的问题