import { create } from 'zustand';
import { Classroom, User } from '../types';

interface ClassroomState {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
  
  fetchUserClassrooms: (userId: string) => Promise<void>;
  createClassroom: (name: string, description: string, teacherId: string) => Promise<Classroom>;
  joinClassroom: (classCode: string, student: User) => Promise<void>;
  leaveClassroom: (classroomId: string, studentId: string) => Promise<void>;
  removeStudent: (classroomId: string, studentId: string) => Promise<void>;
  deleteClassroom: (classroomId: string) => Promise<void>;
}

const useClassroomStore = create<ClassroomState>((set, get) => ({
  classrooms: [],
  loading: false,
  error: null,
  
  fetchUserClassrooms: async (userId: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/api/v1/classroom/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token for authentication
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch classrooms");
      }

      const data = await response.json();
      set({ classrooms: data.data, loading: false }); // Assuming classrooms are in `data.data`
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
      set({ error: "Failed", loading: false });
    }
  },
  
  createClassroom: async (name: string, description: string, teacherId: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
        if (!accessToken) throw new Error("Unauthorized");
    set({ loading: true, error: null });

    try {
      const response = await fetch('http://localhost:3000/api/v1/classroom/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, description, teacherId}),
      });

      if (!response.ok) {
        const text = await response.text(); // Read raw response
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Failed to create classroom');
        } catch {
          throw new Error(`Unexpected response: ${text}`); // Handle HTML responses
        }
      }

      const data = await response.json(); // Now safely parse JSON
      set(state => ({ classrooms: [...state.classrooms, data], loading: false }));
      return data;
    } catch (error) {
      console.error('Failed to create classroom:', error);
      set({ error:'Failed to create classroom', loading: false });
      throw error;
    }
  },


  
  joinClassroom: async (classCode: string, student: User) => {
  const accessToken = localStorage.getItem("accessToken"); // Get token
  if (!accessToken) throw new Error("Unauthorized");

  set({ loading: true, error: null });

  try {
    const response = await fetch(`http://localhost:3000/api/v1/classroom/join`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ classCode, studentId: student.id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join classroom: ${response.statusText}`);
    }

    const updatedClassroom = await response.json(); // Use API response

    // Update state with the actual API response
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.classCode === classCode ? updatedClassroom : classroom
      ),
      loading: false
    }));

  } catch (error) {
    console.error('Failed to join classroom:', error);
    set({ error: 'Failed to join classroom', loading: false });
    throw error;
  }
  },
  
  leaveClassroom: async (classCode: string, studentId: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/api/v1/classroom/leave`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ classCode,studentId }),
      });
      
      // Update mock classroom
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to leave classroom");
      }

      // Remove the student from the classroom in the frontend state
      set(state => ({
          classrooms: state.classrooms.filter(classroom => classroom.classCode !== classCode),
          loading: false
      }));

  } catch (error) {
      console.error('Failed to leave classroom:', error);
      set({ error: 'Failed to leave classroom', loading: false });
      throw error;
  }
  },
  
  removeStudent: async (classCode: string, email: string) => {
    // This is the same as leaveClassroom but initiated by the teacher
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/api/v1/classroom/remove-student`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ classCode, email }),
      });
      
      // Update mock classroom
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove student");
      }

      set(state => ({
        classrooms: state.classrooms.map(classroom => 
            classroom.classCode === classCode 
            ? { 
                ...classroom, 
                students: classroom.students.filter(student => student.email !== email) 
              } 
            : classroom
        ),
        loading: false
    }));
    

    } catch (error) {
        console.error('Failed to remove student:', error);
        set({ error: 'Failed to remove student', loading: false });
        throw error;
    }
  },
  
  deleteClassroom: async (classCode: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");
    set({ loading: true, error: null });
    try {
      await fetch(`http://localhost:3000/api/v1/classroom/${classCode}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      
      // Remove classroom from state
      set(state => ({
        classrooms: state.classrooms.filter(classroom => classroom.classCode !== classCode),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to delete classroom:', error);
      set({ error: 'Failed to delete classroom', loading: false });
      throw error;
    }
  }
}));

export default useClassroomStore;