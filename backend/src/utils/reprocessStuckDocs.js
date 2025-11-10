/**
 * Script to reprocess stuck documents (processing status)
 * Run with: node src/utils/reprocessStuckDocs.js
 */

require("dotenv").config();
const { getAllDocuments, updateDocument } = require("./database");
const { processDocument } = require("./aiProcessor");

const reprocessStuckDocuments = async () => {
  try {
    console.log("🔍 Checking for stuck/failed documents...");
    const documents = await getAllDocuments();

    // Find documents that are stuck in processing or failed
    const stuckDocs = documents.filter(
      (doc) =>
        doc.processingStatus === "processing" ||
        doc.processingStatus === "failed"
    );

    if (stuckDocs.length === 0) {
      console.log("✅ No stuck documents found.");
      return;
    }

    console.log(
      `📋 Found ${stuckDocs.length} stuck document(s). Starting reprocessing...`
    );

    for (const doc of stuckDocs) {
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
  reprocessStuckDocuments()
    .then(() => {
      console.log("✨ All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { reprocessStuckDocuments };
