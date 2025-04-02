// backend/controllers/testController.js
import { getTranscriptions, getTranscriptionById } from "../models/transcriptionModel.js";

export async function fetchResults(req, res) {
  try {
    const results = await getTranscriptions();
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function fetchResultById(req, res) {
  try {
    const { id } = req.params;
    const result = await getTranscriptionById(id);
    
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}