import React, { useState } from 'react';
import { getImmersiveToken } from '../services/api';

declare const ImmersiveReader: any;

interface ReaderLauncherProps {
    initialContent?: string;
    initialTitle?: string;
    autoLaunch?: boolean;
}

export const ReaderLauncher: React.FC<ReaderLauncherProps> = ({ initialContent = '', initialTitle = '', autoLaunch = false }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasLaunched, setHasLaunched] = useState(false);

    React.useEffect(() => {
        if (autoLaunch && !hasLaunched && content) {
            handleLaunch();
            setHasLaunched(true);
        }
    }, [autoLaunch, hasLaunched, content]);

    const handleLaunch = async () => {
        setLoading(true);
        setError(null);
        try {
            const { token, subdomain } = await getImmersiveToken();

            const data = {
                title: title,
                chunks: [{
                    content: content,
                    mimeType: "text/html"
                }]
            };

            const options = {
                uiZIndex: 2000,
                cookiePolicy: 1, // Enable cookie policy
            };

            ImmersiveReader.launchAsync(token, subdomain, data, options)
                .catch((error: any) => {
                    console.error("Error launching Immersive Reader", error);
                    setError("Failed to launch reader. Check console.");
                });

        } catch (err: any) {
            setError(err.message || "Failed to get token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold">Immersive Reader Launcher</h2>

            <div className="flex flex-col space-y-2">
                <label className="font-semibold">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    placeholder="Enter title..."
                />
            </div>

            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <label className="font-semibold">Content</label>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isEditing ? 'Show Preview' : 'Edit Source'}
                    </button>
                </div>

                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border p-2 rounded h-48 font-mono text-sm"
                        placeholder="Enter HTML content..."
                    />
                ) : (
                    <div
                        className="border p-4 rounded h-48 overflow-y-auto bg-gray-50 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
                onClick={handleLaunch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 w-full"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Launch Reader'}
            </button>
        </div>
    );
};
