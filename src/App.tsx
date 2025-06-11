import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutDashboard, BarChart as ChartBar, Bot } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import OptimizationForm from './components/OptimizationForm';
import ResultsTable from './components/ResultsTable';
import Pdfexport from './components/Pdfexport'; // Import the Pdfexport component
import AnalyticsView from './components/AnalyticsView';
import LoginPage from './components/LoginPage'; // Import LoginPage component
import OptimizationSuggestions from './components/OptimizationSuggestions';
import AiAssistant from './components/AiAssistant';
import { OptimizationResult, OptimizationSummary } from './types/types';
import { useDarkMode } from './hooks/useDarkMode';
import { optimizeUpsWithPlates } from './utils/optimizer';
import { checkAuth, logout as logoutUser } from './services/auth';
function App() {
  const [userData, setUserData] = useState(() => checkAuth());
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!userData);
  const [csvData, setCsvData] = useState<Array<{ COLOR: string; SIZE: string; QTY: number }> | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [results, setResults] = useState<OptimizationResult[] | null>(null);
  const [summary, setSummary] = useState<OptimizationSummary | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'results' | 'analytics' | 'assistant'>('results');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleCsvUpload = (
    data: Array<{ COLOR: string; SIZE: string; QTY: number }>,
    name: string
  ) => {
    setCsvData(data);
    setFileName(name);
  };

  const handleOptimizationComplete = (
    optimizationResults: OptimizationResult[],
    optimizationSummary: OptimizationSummary
  ) => {
    setResults(optimizationResults);
    setSummary(optimizationSummary);
    setCalculating(false);
  };

  const handleOptimize = (upsPerPlate: number, plateCount: number) => {
    if (!csvData) return;

    setCalculating(true);

    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      try {
        const { results, summary } = optimizeUpsWithPlates(csvData, upsPerPlate, plateCount);
        handleOptimizationComplete(results, summary);
      } catch (error) {
        console.error('Optimization error:', error);
        setCalculating(false);
      }
    });
  };

  

  const handleLogin = (
    data: { username: string; role: string; lastLogin: string }
  ) => {
    setUserData(data);
    setIsLoggedIn(true); // Set logged-in state to true
  };

  const handleLogout = () => {
    logoutUser();
    setUserData(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          fileName={fileName}
          user={userData!}
          onLogout={handleLogout}
        />

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Always visible */}
            <div className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
              <div className="space-y-6">
                {!csvData ? (
                  <FileUpload onUpload={handleCsvUpload} />
                ) : (
                  <>
                    {/* CSV Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loaded Data
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{fileName}</div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {csvData.length} items loaded
                      </div>
                    </div>

                    {/* Optimization Form */}
                    <OptimizationForm
                      onOptimize={handleOptimize}
                      isCalculating={calculating}
                      isDisabled={!csvData}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              {results && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
                      <div className="text-sm font-semibold">Total Sheets</div>
                      <div className="text-xl font-bold">{summary?.totalSheets.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-teal-600 p-4 rounded-lg shadow-lg text-white">
                      <div className="text-sm font-semibold">Required Order Qty</div>
                      <div className="text-xl font-bold">{summary?.totalItems.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-600 p-4 rounded-lg shadow-lg text-white">
                      <div className="text-sm font-semibold">Qty Produced As Per Ratio</div>
                      <div className="text-xl font-bold">{summary?.totalProduced.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-r from-red-400 to-red-600 p-4 rounded-lg shadow-lg text-white">
                      <div className="text-sm font-semibold">Excess Qty in Pieces</div>
                      <div className="text-xl font-bold">{summary?.wastePercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  {/* Pdfexport Component for PDF Export */}
                  {summary && <Pdfexport summary={summary} results={results} />}
                  {/* Tabs */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex gap-4 px-4">
                        <button
                          className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'results'
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('results')}
                        >
                          <LayoutDashboard size={18} className="inline-block mr-2" />
                          Results
                        </button>
                        <button
                          className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'analytics'
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('analytics')}
                        >
                          <ChartBar size={18} className="inline-block mr-2" />
                          Analytics
                        </button>
                        <button
                          className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'assistant'
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('assistant')}
                        >
                          <Bot size={18} className="inline-block mr-2" />
                          Assistant
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {activeTab === 'results' ? (
                        <>
                          <ResultsTable results={results} />
                          {summary && (
                            <div className="mt-6">
                              <OptimizationSuggestions summary={summary} />
                            </div>
                          )}
                        </>
                      ) : activeTab === 'analytics' ? (
                        <AnalyticsView results={results} />
                      ) : (
                        <AiAssistant summary={summary} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    </div>
  );
}

export default App;
