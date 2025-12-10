const puppeteer = require("puppeteer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function runPuppeteerLogic({ email, password, resumeSummary, apiKey }) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const page = await browser.newPage();

  await page.goto("https://internshala.com/login/student", {
    waitUntil: "networkidle2",
  });

  await page.type("input[id='email']", email, { delay: 50 });
  await page.type("input[id='password']", password, { delay: 50 });
  await page.click("button[id='login_submit']");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("https://internshala.com/internships/matching-preferences/", {
    waitUntil: "networkidle2",
  });

  const internshipLinks = await page.$$eval(".individual_internship", (cards) =>
    cards
      .map((card) => {
        const anchor = card.querySelector("a");
        return anchor ? anchor.href : null;
      })
      .filter(Boolean)
  );

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let applied = 0;

  for (const link of internshipLinks.slice(0, 5)) {
    try {
      await page.goto(link, { waitUntil: "networkidle2" });

      const applyNowButton = await page.$("button#top_easy_apply_button");
      if (applyNowButton) {
        await applyNowButton.click();
      } else {
        console.log("❗ 'Apply now' button not found.");
        continue;
      }

      let textAreas;
      try {
        await page.waitForSelector(
          "textarea, #cover_letter_holder .ql-editor",
          {
            timeout: 10000,
          }
        );

        textAreas = await page.$$(
          "textarea[placeholder='Enter text ...'], #cover_letter_holder .ql-editor"
        );
      } catch (err) {
        console.warn("❗ No text areas found, proceeding to submit.");
        textAreas = [];
      }

      if (textAreas.length > 0) {
        const questions = await page.$$eval(
          ".assessment_question label",
          (labels) => labels.map((q) => q.textContent.trim())
        );

        if (questions.length !== textAreas.length) {
          console.warn("❗ Question count mismatch.");
          continue;
        }

        for (let i = 0; i < questions.length; i++) {
          const prompt = `My resume:\n${resumeSummary}\n\nPlease answer this internship assessment question in under 100 words:\n"${questions[i]}"`;
          const result = await model.generateContent(prompt);
          const answer = await result.response.text();

          await textAreas[i].click({ clickCount: 3 });
          await textAreas[i].type(answer, { delay: 20 });
        }
      }

      const submitBtn = await page.$("input#submit");
      if (submitBtn) {
        await submitBtn.click();
        applied++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (err) {
      console.error("❗ Skipped an internship due to error:", err.message);
    }
  }

  await browser.close();
  return `✅ Applied to ${applied} internships successfully!`;
}

module.exports = { runPuppeteerLogic };
