import { setupWorker, rest } from "msw";

const worker = setupWorker(
  rest.get("https://github.com/octocat", (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.status(202, "Mocked status"),
      ctx.json({
        message: "Mocked response JSON body",
      })
    );
  })
);

worker.start();
