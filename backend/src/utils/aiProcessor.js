const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs").promises;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Extract text content from a file
 */
const extractTextFromFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Failed to read file content");
  }
};

/**
 * Generate a summary of the document using Claude
 */
const generateSummary = async (text) => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Please provide a concise summary of the following document. Focus on the main points, key information, and overall purpose. Keep the summary clear and informative.

Document content:
${text.substring(0, 100000)}`, // Limit to ~100k chars to stay within token limits
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
};

/**
 * Convert document to clean markdown format using Claude
 */
const generateMarkdown = async (text) => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Please convert the following document into clean, well-structured markdown format. Organize the content with appropriate headings, lists, and formatting. Maintain the original information while improving readability.

Document content:
${text.substring(0, 100000)}`, // Limit to ~100k chars
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error("Error generating markdown:", error);
    throw new Error("Failed to generate markdown");
  }
};

/**
 * Process a document: extract text, generate summary and markdown
 */
const processDocument = async (filePath) => {
  try {
    console.log("Processing document:", filePath);

    // Extract text from file
    const text = await extractTextFromFile(filePath);
    console.log("Text extracted, length:", text.length);

    // Generate summary and markdown in parallel
    console.log("Generating summary and markdown with Claude...");
    const [summary, markdown] = await Promise.all([
      generateSummary(text),
      generateMarkdown(text),
    ]);

    console.log("AI processing complete");

    return {
      summary,
      markdown,
      success: true,
    };
  } catch (error) {
    console.error("Error processing document:", error);
    return {
      summary: null,
      markdown: null,
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  processDocument,
  extractTextFromFile,
  generateSummary,
  generateMarkdown,
};
