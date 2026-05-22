const fs = require('fs').promises;
const path = require('path');

class UploadsService {
  async serveFile(filename) {
    const filePath = path.join(__dirname, '../../uploads', filename);
    try {
      const data = await fs.readFile(filePath);
      return data;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }
}

module.exports = UploadsService;
