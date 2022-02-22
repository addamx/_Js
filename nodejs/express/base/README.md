#Express

Express框架的核心是对http模块的再包装。Express框架等于在http模块之上，加了一个中间层。
中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。

每个中间件可以从App实例，接收三个参数，依次为**request对象（代表HTTP请求）**、**response对象（代表HTTP回应）**，**next回调函数（代表下一个中间件）**。
