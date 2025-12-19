const axios = require('axios');

class GitHubStorageService {
    constructor() {
        this.owner = process.env.GITHUB_OWNER;
        this.repo = process.env.GITHUB_REPO;
        this.basePath = process.env.GITHUB_PATH || 'public/library';
        this.token = process.env.GITHUB_TOKEN;
    }

    init() {
        if (!this.token || !this.owner || !this.repo) {
            console.warn('⚠️ GitHub Storage not configured: Missing GITHUB_TOKEN, OWNER, or REPO.');
            return false;
        }
        return true;
    }

    // Since we don't want to install @octokit/rest dependency just for this simple PUT,
    // let's use axios for raw GitHub API calls to keep dependencies light?
    // Wait, package.json has axios. Let's use axios.
    // Or we can install octokit. The original code used octokit. 
    // Let's stick to the original plan -> used axios in package.json, didn't add octokit.
    // I will refactor to use axios for GitHub API to match package.json dependencies I created.

    async uploadImage(word, buffer, ext = 'jpg') {
        if (!this.init()) return null;

        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(word.trim().toLowerCase()).digest('hex').substring(0, 12);
        // Use timestamp to ensure unique filename on every generation/regeneration
        const timestamp = Date.now();
        const filename = `${hash}_${timestamp}.${ext}`;
        const path = `${this.basePath}/${filename}`;
        const content = buffer.toString('base64');
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;

        console.log(`🚀 Uploading ${filename} to GitHub...`);

        try {
            // Since we are using timestamp, it's highly unlikely to exist. 
            // We can skip the GET check and go straight to PUT to save API calls.

            // 2. PUT to create
            const body = {
                message: `Add image for "${word}" (v_${timestamp})`,
                content: content,
                committer: { name: 'KidsVocabBot', email: 'bot@kidsvocab.generated' }
            };

            await axios.put(url, body, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            console.log(`✅ Upload successful: ${path}`);
            return this.getRawUrl(filename);

        } catch (error) {
            console.error(`❌ GitHub Upload Failed for ${word}:`, error.message);
            return null;
        }
    }

    async deleteImage(word, ext = 'jpg') {
        if (!this.init()) return false;

        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(word.trim().toLowerCase()).digest('hex').substring(0, 12);
        const filename = `${hash}.${ext}`;
        const path = `${this.basePath}/${filename}`;
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;

        try {
            const getRes = await axios.get(url, {
                headers: { 'Authorization': `token ${this.token}` }
            });
            const sha = getRes.data.sha;

            await axios.delete(url, {
                headers: { 'Authorization': `token ${this.token}` },
                data: {
                    message: `Delete banned image for "${word}"`,
                    sha: sha,
                    committer: { name: 'KidsVocabBot', email: 'bot@kidsvocab.generated' }
                }
            });
            return true;
        } catch (error) {
            console.error(`❌ GitHub Delete Failed:`, error.message);
            return false;
        }
    }

    getRawUrl(filename) {
        return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${this.basePath}/${filename}`;
    }
}

module.exports = new GitHubStorageService();
