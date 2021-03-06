const puppeteer = require("puppeteer");
const {
  getRootDir,
  addHttpPrefix,
  sendErrorMessage,
  getLoadingMessage
} = require("../../utils");

module.exports = {
  name: "viewlink",
  aliases: ["vl"],
  description: "Get page view from a link",
  cooldown: 15,
  args: true,
  usage: "https://google.com",
  execute(message, args) {
    const TOTAL_STEP = 6;

    message.channel
      .send(getLoadingMessage(1, TOTAL_STEP))
      .then(async msg => {
        const additionalSelector = args.slice(1).join(" ");

        const browser = await puppeteer.launch({
          args: ["--no-sandbox"]
        });

        msg.edit(getLoadingMessage(2, TOTAL_STEP));

        const page = await browser.newPage();

        msg.edit(getLoadingMessage(3, TOTAL_STEP));

        await page.goto(addHttpPrefix(args[0]), {
          waitUntil: "networkidle0"
        });

        msg.edit(getLoadingMessage(4, TOTAL_STEP));

        if (additionalSelector) {
          const targetElement = await page.$(additionalSelector);

          msg.edit(getLoadingMessage(5, TOTAL_STEP));

          await targetElement.screenshot({
            path: `${getRootDir()}/public/puppeteer.jpg`,
            type: "jpeg"
          });
        } else {
          await page.screenshot({
            path: `${getRootDir()}/public/puppeteer.jpg`,
            type: "jpeg",
            fullPage: true
          });
        }

        msg.edit(getLoadingMessage(6, TOTAL_STEP));

        await browser.close();

        return message.channel
          .send({
            files: [{ attachment: `${getRootDir()}/public/puppeteer.jpg` }]
          })
          .then(() => {
            msg.delete(10000);
          });
      })
      .catch(error => {
        return sendErrorMessage(message, error);
      });
  }
};
