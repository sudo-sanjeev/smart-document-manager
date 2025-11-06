/**
 * Script to reprocess failed documents
 * Run with: node src/utils/reprocessFailedDocs.js
 */

require("dotenv").config();
const { getAllDocuments, updateDocument } = require("./database");
const { processDocument } = require("./aiProcessor");

const reprocessFailedDocuments = async () => {
  try {
    console.log("🔍 Checking for failed documents...");
    const documents = await getAllDocuments();
    const failedDocs = documents.filter(
      (doc) => doc.processingStatus === "failed"
    );

    if (failedDocs.length === 0) {
      console.log("✅ No failed documents found.");
      return;
    }

    console.log(
      `📋 Found ${failedDocs.length} failed document(s). Starting reprocessing...`
    );

    for (const doc of failedDocs) {
      console.log(`\n⏳ Processing: ${doc.name} (${doc.id})`);

      try {
        // Update to processing status
        await updateDocument(doc.id, {
          processingStatus: "processing",
        });

        // Process the document
        const result = await processDocument(doc.path);

        if (result.success) {
          await updateDocument(doc.id, {
            summary: result.summary,
            markdown: result.markdown,
            processingStatus: "completed",
          });
          console.log(`✅ Successfully processed: ${doc.name}`);
        } else {
          await updateDocument(doc.id, {
            processingStatus: "failed",
          });
          console.log(`❌ Failed to process: ${doc.name} - ${result.error}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${doc.name}:`, error.message);
        await updateDocument(doc.id, {
          processingStatus: "failed",
        });
      }
    }

    console.log("\n🎉 Reprocessing complete!");
  } catch (error) {
    console.error("❌ Error during reprocessing:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  reprocessFailedDocuments()
    .then(() => {
      console.log("✨ All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { reprocessFailedDocuments };
