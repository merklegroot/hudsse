export default function DotNetInstallLink() {
    return (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">I do it myself!</h3>
                    <p className="text-blue-700 text-sm">
                        This tool is for managing multiple installations and troubleshooting issues.
                    </p>
                    <p className="text-blue-700 text-sm">
                        Most people should just follow the simple instructions on Microsoft's page.
                    </p>

                    <a
                        href="https://dotnet.microsoft.com/en-us/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Download .NET
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}