import { useState } from "react";
import { CloudUpload, X } from "lucide-react";

const AiFeatures = () => {
  const [file, setFile] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(""); // State for selected language
  const [selectedScript, setSelectedScript] = useState(""); // State for selected script
  const [question, setQuestion] = useState(""); // State for the question (Q&A feature)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null); // State to store API response

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    setApiResponse(null); // Clear the response when the file is removed
  };

  const handleSubmit = async () => {
    if (!file || !selectedFeature) {
      alert("Please upload a file and select a feature before submitting.");
      return;
    }

    if (selectedFeature === "Translate Text" && !selectedLanguage) {
      alert("Please select a language for translation.");
      return;
    }

    if (selectedFeature === "Transliteration" && !selectedScript) {
      alert("Please select a target script for transliteration.");
      return;
    }

    if (selectedFeature === "Q&A" && !question) {
      alert("Please enter a question for the Q&A feature.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("feature", selectedFeature);

    if (selectedFeature === "Translate Text") {
      formData.append("target_language", selectedLanguage); // Add selected language
      formData.append("file_upload", true); // Add the required boolean parameter
      formData.append("text", ""); // Add an empty value for the "text" parameter
    }

    if (selectedFeature === "Transliteration") {
      formData.append("target_script", selectedScript); // Add selected script
      formData.append("file_upload", true); // Add the required boolean parameter
    }

    if (selectedFeature === "Q&A") {
      formData.append("question", question); // Add the question
      formData.append("file_upload", true); // Add the required boolean parameter
    }
    if (selectedFeature === "Extract Images") {
      formData.append("file_upload", true); // Add the required boolean parameter
    } 

    console.log("Submitting FormData:", Array.from(formData.entries())); // Debugging

    try {
      const response = await fetch(featureEndpoints[selectedFeature], {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setApiResponse(result); // Update the API response state
      } else {
        const error = await response.json();
        console.error("API Error:", error); // Log the error for debugging
        setApiResponse({ error: error.detail || JSON.stringify(error) || "Failed to process the file. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting the file:", error);
      setApiResponse({ error: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
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
    "Q&A": "Upload a PDF file and ask a question.",
  };

  const featureEndpoints = {
    "Extract Text": "http://127.0.0.1:8000/extract-text/",
    "Translate Text": "http://127.0.0.1:8000/translate/",
    "Extract Images": "http://127.0.0.1:8000/extract-images/",
    "Summarize Text": "http://127.0.0.1:8000/summarize-text/",
    "Transliteration": "http://127.0.0.1:8000/transliterate/",
    "Q&A": "http://localhost:8000/qna",
  };

  const scripts = [
    "Devanagari",
    "Bengali",
    "Gujarati",
    "Gurmukhi",
    "Kannada",
    "Malayalam",
    "Oriya",
    "Tamil",
    "Telugu",
    "Sinhala",
    "Thai",
    "Lao",
    "Tibetan",
    "Myanmar",
    "Khmer",
    "Arabic",
    "Hebrew",
    "Cyrillic",
    "Greek",
    "Latin",
  ]; // List of 20 scripts

  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi"]; // Language options

  return (
    <div className="flex h-screen bg-[#f7f3ec] font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#e2d4c4] p-6 shadow-md border-r border-[#c8b9a6]">
        <h2 className="text-2xl font-semibold mb-6 text-[#3d2f22]">AI Features</h2>
        <nav className="space-y-3">
          {Object.keys(featureHeadings).map((feature) => (
            <button
              key={feature}
              onClick={() => {
                setSelectedFeature(feature);
                setApiResponse(null); // Clear the response when a new feature is selected
                setSelectedLanguage(""); // Reset language selection
                setSelectedScript(""); // Reset script selection
                setQuestion(""); // Reset question input
              }}
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
        {selectedFeature && (
          <div className="mt-8 ml-4 p-6 border-2 border-dashed border-[#c8b9a6] rounded-xl bg-[#f7f3ec] flex flex-col items-center justify-center w-fit">
            <label className="flex items-center justify-center cursor-pointer bg-[#35495E] text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all">
              <CloudUpload className="mr-2" size={20} /> Upload File
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}

        {/* Script Dropdown for Transliteration */}
        {selectedFeature === "Transliteration" && (
          <div className="mt-6">
            <label className="block text-[#3d2f22] font-medium mb-2">Select Target Script:</label>
            <select
              value={selectedScript}
              onChange={(e) => setSelectedScript(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8b9a6] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#35495E]"
            >
              <option value="">-- Select a Script --</option>
              {scripts.map((script) => (
                <option key={script} value={script}>
                  {script}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Language Dropdown for Translate Text */}
        {selectedFeature === "Translate Text" && (
          <div className="mt-6">
            <label className="block text-[#3d2f22] font-medium mb-2">Select Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8b9a6] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#35495E]"
            >
              <option value="">-- Select a Language --</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Question Input for Q&A */}
        {selectedFeature === "Q&A" && (
          <div className="mt-6">
            <label className="block text-[#3d2f22] font-medium mb-2">Enter Your Question:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8b9a6] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#35495E]"
              placeholder="Type your question here..."
            />
          </div>
        )}

        {/* Display Uploaded File */}
        {file && (
          <div className="mt-6 p-4 border border-green-400 bg-green-100 text-green-700 rounded-lg flex justify-between items-center shadow">
            <span className="font-medium">{file.name}</span>
            <button onClick={removeFile} className="text-red-500 hover:text-red-700">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Submit Button */}
        {file && selectedFeature && (
          <button
            onClick={handleSubmit}
            className={`mt-6 px-6 py-3 rounded-lg text-white font-medium shadow ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#35495E] hover:bg-[#2c3e50]"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}

        {/* Mini Container Below Upload Button */}
        {selectedFeature && (
          <div className="mt-6 p-6 border border-[#c8b9a6] rounded-xl bg-[#f7f3ec] shadow overflow-y-auto max-h-64">
            <h2 className="text-xl font-semibold text-[#3d2f22]">{selectedFeature}</h2>
            <p className="text-gray-700 mt-2">
              {apiResponse
                ? apiResponse.error
                  ? `Error: ${apiResponse.error}`
                  : `Response: ${JSON.stringify(apiResponse)}`
                : "Feature details go here..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeatures;