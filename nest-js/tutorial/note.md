# cli
- nest g controller cats
- nest g service cats
- 
- 
- 
- 
- 
- 
- 
- 
- 
# package
- npm install --save @hapi/joi
- npm install --save-dev @types/hapi__joi
- npm i --save class-validator class-transformer
- 
- npm install @nestjs/jwt passport-jwt
- npm install @types/passport-jwt --save-dev
- 
- 
# Pipe
- ValidationPipe 需要同时安装 class-validator 和 class-transformer 包）
- 
- 
- 
# Guard
- canActivate()函数: 返回一个布尔值，指示是否允许当前请求。
- 对于混合应用程序，useGlobalGuards() 方法不会为网关和微服务设置守卫。对于“标准”(非混合)微服务应用程序，useGlobalGuards()在全局安装守卫。
- 
- 
# config
- 上述代码将从默认位置（项目根目录）载入并解析一个.env文件，从.env文件和process.env合并环境变量键值对，并将结果存储到一个可以通过ConfigService访问的私有结构。forRoot()方法注册了ConfigService提供者，后者提供了一个get()方法来读取这些解析/合并的配置变量。由于@nestjs/config依赖dotenv，可以加`ignoreEnvFile: true`来忽略.env文件

# Typescript
- `Record<string, unknown>`


# Test Cli
- curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"



# 请求生命周期大致如下：

- 收到请求
- 全局绑定的中间件
- 模块绑定的中间件
- 全局守卫
- 控制层守卫
- 路由守卫
- 全局拦截器（控制器之前）
- 控制器层拦截器 （控制器之前）
- 路由拦截器 （控制器之前）
- 全局管道
- 控制器管道
- 路由管道
- 路由参数管道
- 控制器（方法处理器） 15。服务（如果有）
- 路由拦截器（请求之后）
- 控制器拦截器 （请求之后）
- 全局拦截器 （请求之后）
- 异常过滤器 （路由，之后是控制器，之后是全局）
- 服务器响应
