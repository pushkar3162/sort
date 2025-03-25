import { useState } from "react";
import { CloudUpload, X } from "lucide-react";

const AiFeatures = () => {
  const [file, setFile] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
  };

  const featureHeadings = {
    "Extract Text": "Document Upload and Viewer",
    "Translate Text": "AI-Powered Document & Text Translation",
    "Extract Images": "Extract Images from PDF",
    "Summarize Text": "AI Powered Text Summarization",
    "Transliteration": "AI-Powered Text Transliterations",
    "Q&A": "AI-Powered Question & Answer from PDF/Text",
  };

  const featureSubtexts = {
    "Extract Text": "Upload PDF/DOCX/Images to view its content.",
    "Translate Text": "Upload PDF/DOCX to view its content.",
    "Extract Images": "Upload a PDF file.",
    "Summarize Text": "Upload a document (PDF/DOCX).",
    "Transliteration": "Upload a document (PDF/DOCX).",
    "Q&A": "Upload a PDF file.",
  };

  return (
    <div className="flex h-screen bg-[#f7f3ec] font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#e2d4c4] p-6 shadow-md border-r border-[#c8b9a6]">
        <h2 className="text-2xl font-semibold mb-6 text-[#3d2f22]">AI Features</h2>
        <nav className="space-y-3">
          {Object.keys(featureHeadings).map((feature) => (
            <button
              key={feature}
              onClick={() => setSelectedFeature(feature)}
              className={`w-full text-left px-4 py-3 rounded-lg text-md font-medium transition-all duration-200 ${
                selectedFeature === feature
                  ? "bg-[#35495E] text-white shadow"
                  : "bg-white text-[#3d2f22] border border-[#c8b9a6] hover:shadow-md hover:bg-[#d6cbc0]"
              }`}
            >
              {feature}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-10 bg-white shadow-inner">
        <h1 className="text-3xl font-bold text-[#3d2f22]">
          {featureHeadings[selectedFeature] || "Select a Feature"}
        </h1>
        <p className="text-gray-700 mt-2 text-base">
          {featureSubtexts[selectedFeature] ||
            "Click on a feature to show its content next to the upload section."}
        </p>

        {/* Upload Section */}
        <div className="mt-8 ml-4 p-6 border-2 border-dashed border-[#c8b9a6] rounded-xl bg-[#f7f3ec] flex flex-col items-center justify-center w-fit">
          <label className="flex items-center justify-center cursor-pointer bg-[#35495E] text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all">
            <CloudUpload className="mr-2" size={20} /> Upload File
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Display Uploaded File */}
        {file && (
          <div className="mt-6 p-4 border border-green-400 bg-green-100 text-green-700 rounded-lg flex justify-between items-center shadow">
            <span className="font-medium">{file.name}</span>
            <button onClick={removeFile} className="text-red-500 hover:text-red-700">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Mini Container Below Upload Button */}
        {selectedFeature && (
          <div className="mt-6 p-6 border border-[#c8b9a6] rounded-xl bg-[#f7f3ec] shadow">
            <h2 className="text-xl font-semibold text-[#3d2f22]">{selectedFeature}</h2>
            <p className="text-gray-700 mt-2">Feature details go here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeatures;