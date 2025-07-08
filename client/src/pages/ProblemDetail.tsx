import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../utils/api';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{
    input: string;
    expected: string;
  }>;
}

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `function solve(input) {
  // Write your code here
  return '';
}

// Example usage:
// console.log(solve('1 2'));
`,
  python: `def solve(input):
    # Write your code here
    return ''

# Example usage:
# print(solve('1 2'))
`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

string solve(string input) {
    // Write your code here
    return "";
}

// int main() {
//     cout << solve("1 2") << endl;
// }
`,
  java: `public class Solution {
    public static String solve(String input) {
        // Write your code here
        return "";
    }

    // public static void main(String[] args) {
    //     System.out.println(solve("1 2"));
    // }
}
`
};

const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [lastTemplate, setLastTemplate] = useState(CODE_TEMPLATES[language]);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      if (slug) {
        setLoading(true);
        try {
          const res = await api.get(`/problems/${slug}`);
          setProblem(res.data.problem);
        } catch (err) {
          console.error('Failed to fetch problem');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProblem();
  }, [slug]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const newTemplate = CODE_TEMPLATES[newLang] || '';
    if (!code.trim() || code === lastTemplate) {
      setCode(newTemplate);
    }
    setLanguage(newLang);
    setLastTemplate(newTemplate);
  };

  const handleRunCode = async () => {
    setRunning(true);
    setRunOutput('');
    setTestResults([]);
    try {
      const res = await api.post(`/problems/${problem?._id}/run`, {
        code,
        language
      });
      setRunOutput(res.data.output || '');
      setTestResults(res.data.testResults || []);
    } catch (err: any) {
      setRunOutput(err.response?.data?.error || 'Run failed.');
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput('');
    setAnalysis('');
    setAnalysisError('');
    try {
      const res = await api.post(`/problems/${problem?._id}/submit`, {
        code,
        language
      });
      setOutput(res.data.output || 'Submitted successfully!');
      
      // AI analysis
      setAnalyzing(true);
      try {
        const aiRes = await api.post('/ai/analyze-solution', {
          problemId: problem?._id,
          solution: code,
          language
        });
        setAnalysis(aiRes.data.analysis || 'No analysis available.');
      } catch (err: any) {
        setAnalysisError(err.response?.data?.error || 'Failed to analyze solution.');
      }
      setAnalyzing(false);
    } catch (err: any) {
      setOutput(err.response?.data?.error || 'Submission failed.');
    }
    setSubmitting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success-400';
      case 'medium': return 'text-warning-400';
      case 'hard': return 'text-error-400';
      default: return 'text-dark-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Problem not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problem Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{problem.title}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)} bg-dark-700`}>
                {problem.difficulty}
              </span>
              <div className="flex space-x-2">
                {problem.topics.map((topic) => (
                  <span key={topic} className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="prose prose-invert max-w-none">
          <div className="text-dark-300 whitespace-pre-wrap">{problem.description}</div>
        </div>

        {/* Constraints */}
        {problem.constraints.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Constraints:</h3>
            <ul className="list-disc list-inside space-y-1 text-dark-300">
              {problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {problem.examples.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Examples:</h3>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-dark-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-dark-300 mb-2">Input:</h4>
                      <pre className="bg-dark-800 p-3 rounded text-sm">{example.input}</pre>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dark-300 mb-2">Output:</h4>
                      <pre className="bg-dark-800 p-3 rounded text-sm">{example.output}</pre>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-dark-300 mb-2">Explanation:</h4>
                      <p className="text-dark-300 text-sm">{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Editor Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Code Editor</h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="input w-40"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        
        <Editor
          height="400px"
          defaultLanguage={language}
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{ 
            fontSize: 16, 
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
        
        <div className="flex space-x-4 mt-4">
          <button
            className="btn-secondary"
            onClick={handleRunCode}
            disabled={running}
          >
            {running ? 'Running...' : 'Run Code'}
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>

        {/* Run Results */}
        {(runOutput || testResults.length > 0) && (
          <div className="mt-4 p-4 bg-dark-800 rounded-lg">
            <h3 className="text-white font-medium mb-3">Execution Results:</h3>
            {runOutput && (
              <div className="mb-4">
                <strong className="text-white">Output:</strong>
                <pre className="whitespace-pre-wrap mt-2 text-dark-300 bg-dark-900 p-3 rounded">{runOutput}</pre>
              </div>
            )}
            
            {testResults.length > 0 && (
              <div>
                <strong className="text-white">Test Cases:</strong>
                <div className="mt-3 space-y-3">
                  {testResults.map((test, index) => (
                    <div key={index} className={`p-3 rounded-lg ${test.passed ? 'bg-success-900/30' : 'bg-error-900/30'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-dark-300">Input:</span>
                          <pre className="mt-1 bg-dark-900 p-2 rounded">{test.input}</pre>
                        </div>
                        <div>
                          <span className="text-dark-300">Expected:</span>
                          <pre className="mt-1 bg-dark-900 p-2 rounded">{test.expected}</pre>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-dark-300">Your Output:</span>
                        <pre className="mt-1 bg-dark-900 p-2 rounded">{test.output}</pre>
                      </div>
                      {test.stderr && (
                        <div className="mt-3">
                          <span className="text-error-400">Error:</span>
                          <pre className="mt-1 bg-error-900/50 p-2 rounded text-error-300">{test.stderr}</pre>
                        </div>
                      )}
                      <div className="mt-2">
                        <span className={`font-medium ${test.passed ? 'text-success-400' : 'text-error-400'}`}>
                          {test.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submission Result */}
        {output && (
          <div className="mt-4 p-4 bg-dark-800 rounded-lg">
            <strong className="text-white">Submission Result:</strong>
            <pre className="whitespace-pre-wrap mt-2 text-dark-300">{output}</pre>
          </div>
        )}

        {/* AI Analysis */}
        {(analyzing || analysis || analysisError) && (
          <div className="mt-4 p-4 bg-dark-800 rounded-lg">
            <strong className="text-white">AI Code Analysis:</strong>
            {analyzing && <div className="mt-2 text-dark-300">Analyzing your code...</div>}
            {analysis && <pre className="whitespace-pre-wrap mt-2 text-info-300">{analysis}</pre>}
            {analysisError && <div className="mt-2 text-error-400">{analysisError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail; 