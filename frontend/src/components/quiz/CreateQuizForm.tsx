import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';
import useQuizStore from '../../store/quizStore';
import useAuthStore from '../../store/authStore';
import { Question, QuestionType } from '../../types';

interface CreateQuizFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  questions: {
    text: string;
    type: QuestionType;
    options: string[];
    correctAnswer: string;
    topic: string;
  }[];
}

interface CreateQuizFormProps {
  classCode: string;
  onSuccess?: () => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({ classCode, onSuccess }) => {
  const { createQuiz } = useQuizStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateQuizFormData>({
    defaultValues: {
      title: '',
      description: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      duration: 60,
      questions: [
        {
          text: '',
          type: 'mcq',
          options: ['', '', '', ''],
          correctAnswer: '0',
          topic: ''
        }
      ]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });
  
  const questionTypes = watch('questions');
  
  const addQuestion = () => {
    append({
      text: '',
      type: 'mcq',
      options: ['', '', '', ''],
      correctAnswer: '0',
      topic: ''
    });
  };
  
  const handleQuestionTypeChange = (index: number, type: QuestionType) => {
    if (type === 'true-false') {
      setValue(`questions.${index}.options`, ['True', 'False']);
    } else if (type === 'mcq' && questionTypes[index].type === 'true-false') {
      setValue(`questions.${index}.options`, ['', '', '', '']);
    }
  };
  
  const onSubmit = async (data: CreateQuizFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedQuestions: Question[] = data.questions.map((q) => ({
        questionText: q.text,
        questionType: q.type,
        options: q.options,
        correctOption: parseInt(q.correctAnswer, 10),
        // topic: q.topic
      }));
      
      
      
      await createQuiz({
        title: data.title,
        description: data.description,
        classCode,
        questions: formattedQuestions,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        createdBy: user.id
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          label="Quiz Title"
          fullWidth
          error={errors.title?.message}
          {...register('title', { 
            required: 'Quiz title is required',
            minLength: {
              value: 3,
              message: 'Quiz title must be at least 3 characters'
            }
          })}
        />
        
        <Textarea
          label="Description"
          fullWidth
          error={errors.description?.message}
          {...register('description', { 
            required: 'Description is required'
          })}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            fullWidth
            error={errors.startTime?.message}
            {...register('startTime', { 
              required: 'Start time is required'
            })}
          />
          
          <Input
            label="End Time"
            type="datetime-local"
            fullWidth
            error={errors.endTime?.message}
            {...register('endTime', { 
              required: 'End time is required',
              validate: value => {
                const startTime = new Date(watch('startTime'));
                const endTime = new Date(value);
                return endTime > startTime || 'End time must be after start time';
              }
            })}
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            fullWidth
            error={errors.duration?.message}
            {...register('duration', { 
              required: 'Duration is required',
              min: {
                value: 1,
                message: 'Duration must be at least 1 minute'
              },
              max: {
                value: 180,
                message: 'Duration cannot exceed 180 minutes'
              }
            })}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button 
            type="button" 
            onClick={addQuestion}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <Card key={field.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Question {index + 1}</h4>
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Textarea
                  label="Question Text"
                  fullWidth
                  error={errors.questions?.[index]?.text?.message}
                  {...register(`questions.${index}.text`, { 
                    required: 'Question text is required'
                  })}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Question Type"
                    fullWidth
                    options={[
                      { value: 'mcq', label: 'Multiple Choice' },
                      { value: 'true-false', label: 'True/False' }
                    ]}
                    {...register(`questions.${index}.type`, { 
                      required: 'Question type is required',
                      onChange: (e) => handleQuestionTypeChange(index, e.target.value as QuestionType)
                    })}
                  />
                  
                  <Input
                    label="Topic"
                    fullWidth
                    error={errors.questions?.[index]?.topic?.message}
                    {...register(`questions.${index}.topic`, { 
                      required: 'Topic is required'
                    })}
                  />
                </div>
                
                {questionTypes[index].type === 'mcq' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Options</label>
                    {[0, 1, 2, 3].map((optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`question-${index}-option-${optionIndex}`}
                          value={optionIndex.toString()}
                          {...register(`questions.${index}.correctAnswer`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <Input
                          fullWidth
                          placeholder={`Option ${optionIndex + 1}`}
                          {...register(`questions.${index}.options.${optionIndex}`, { 
                            required: 'Option text is required'
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {questionTypes[index].type === 'true-false' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Select the correct answer:</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`question-${index}-true`}
                          value="0"
                          {...register(`questions.${index}.correctAnswer`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`question-${index}-true`}>True</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`question-${index}-false`}
                          value="1"
                          {...register(`questions.${index}.correctAnswer`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`question-${index}-false`}>False</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Quiz
      </Button>
    </form>
  );
};

export default CreateQuizForm;