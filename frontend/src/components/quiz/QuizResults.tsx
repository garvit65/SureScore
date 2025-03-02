import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { QuizAttempt } from '../../types';

interface QuizResultsProps {
  quizAttempt: QuizAttempt;
  showConfidenceAnalysis?: boolean;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  quizAttempt,
  showConfidenceAnalysis = true
}) => {
  // Calculate score
  const totalQuestions = quizAttempt.answers.length;
  const correctAnswers = quizAttempt.answers.filter(
    answer => answer.selectedAnswer === answer.questionId
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Confidence analysis
  const confidenceData = {
    highConfidenceCorrect: 0,
    highConfidenceIncorrect: 0,
    lowConfidenceCorrect: 0,
    lowConfidenceIncorrect: 0
  };
  
  quizAttempt.answers.forEach(answer => {
    const isCorrect = answer.selectedAnswer === answer.questionId;
    const isHighConfidence = answer.confidenceLevel >= 4;
    
    if (isCorrect && isHighConfidence) confidenceData.highConfidenceCorrect++;
    if (!isCorrect && isHighConfidence) confidenceData.highConfidenceIncorrect++;
    if (isCorrect && !isHighConfidence) confidenceData.lowConfidenceCorrect++;
    if (!isCorrect && !isHighConfidence) confidenceData.lowConfidenceIncorrect++;
  });
  
  // Get score color
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="space-y-6">
      {/* Score summary */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {score}%
            </div>
            <p className="mt-2 text-gray-600">
              {correctAnswers} out of {totalQuestions} questions correct
            </p>
            
            <div className="w-full mt-6 bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showConfidenceAnalysis && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Confidence Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-green-800">High Confidence & Correct</h3>
                </div>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {confidenceData.highConfidenceCorrect}
                </p>
                <p className="text-sm text-green-700">
                  Questions you were confident about and got right
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-red-800">High Confidence & Incorrect</h3>
                </div>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {confidenceData.highConfidenceIncorrect}
                </p>
                <p className="text-sm text-red-700">
                  Questions you were confident about but got wrong
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-medium text-yellow-800">Low Confidence & Correct</h3>
                </div>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {confidenceData.lowConfidenceCorrect}
                </p>
                <p className="text-sm text-yellow-700">
                  Questions you were unsure about but got right
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Low Confidence & Incorrect</h3>
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-600">
                  {confidenceData.lowConfidenceIncorrect}
                </p>
                <p className="text-sm text-gray-700">
                  Questions you were unsure about and got wrong
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800">What This Means</h3>
              <ul className="mt-2 space-y-2 text-sm text-blue-700">
                <li>
                  <strong>High Confidence & Correct:</strong> Great job! You know this material well.
                </li>
                <li>
                  <strong>High Confidence & Incorrect:</strong> You may have misconceptions about these topics. Focus on reviewing these areas.
                </li>
                <li>
                  <strong>Low Confidence & Correct:</strong> You know more than you think! Build confidence in these areas.
                </li>
                <li>
                  <strong>Low Confidence & Incorrect:</strong> These topics need more study, but at least you recognized your knowledge gaps.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {quizAttempt.answers.map((answer, index) => {
              const isCorrect = answer.selectedAnswer === answer.questionId;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-sm mt-1">
                        Confidence Level: {answer.confidenceLevel}/5
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;