"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Edit, Save, X, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import availableSubjects from "@/constants/subjects"

export default function TeachersManagementPage() {
    const { data: session } = useSession()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingTeacher, setEditingTeacher] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        subjects: [],
        status: "active",
    })

    useEffect(() => {
        if (session?.user?.role === "admin") {
            loadTeachers()
        }
    }, [session])

    const loadTeachers = async () => {
        try {
            const response = await fetch("/api/teachers")
            const data = await response.json()
            setTeachers(data)
        } catch (error) {
            console.error("Error loading teachers:", error)
            toast.error("Failed to load teachers")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Password validation for new teachers or when changing password
        if (!editingTeacher || (editingTeacher && formData.password)) {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match")
                return
            }
        }

        try {
            const teacherData = {
                id: editingTeacher?.id,
                name: formData.name,
                email: formData.email,
                subjects: formData.subjects,
                status: formData.status,
            }

            // Only include password if it's a new teacher or password is being changed
            if (!editingTeacher || (editingTeacher && formData.password)) {
                teacherData.password = formData.password
            }

            const response = await fetch("/api/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(teacherData),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || "Failed to save teacher")
            }

            const result = await response.json()
            toast.success(editingTeacher ? "Teacher updated successfully" : "Teacher created successfully")
            setShowAddForm(false)
            setEditingTeacher(null)
            resetForm()
            loadTeachers()
        } catch (error) {
            console.error("Error saving teacher:", error)
            toast.error(error.message || "Failed to save teacher")
        }
    }

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher)
        setFormData({
            name: teacher.name,
            email: teacher.email,
            password: "",
            confirmPassword: "",
            subjects: teacher.subjects || [],
            status: teacher.status || "active",
        })
        setShowAddForm(true)
    }

    const handleSubjectToggle = (subject) => {
        setFormData((prev) => {
            const subjects = prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject]
            return { ...prev, subjects }
        })
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            subjects: [],
            status: "active",
        })
        setShowPassword(false)
    }

    const updatePassword = async (teacherId, newPassword) => {
        try {
            const response = await fetch(`/api/teachers/${teacherId}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: newPassword }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || "Failed to update password")
            }
            toast.success("Password updated successfully")
        } catch (error) {
            console.error("Error updating password:", error)
            toast.error(error.message || "Failed to update password")
        }
    }

    if (!session || session.user.role !== "admin") {
        return <div className="text-center py-8 text-gray-500">You don&apos;t have permission to view this page.</div>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Teacher Management</h1>
                <button
                    onClick={() => {
                        setShowAddForm(true)
                        setEditingTeacher(null)
                        resetForm()
                    }}
                    className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:text-black"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Teacher
                </button>
            </div>

            {showAddForm && (
                <div className="mb-8 p-6 border border-slate-500 rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-200">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="bg-transparent text-white border border-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-200">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-200">
                                    {editingTeacher ? "New Password (leave blank to keep current)" : "Password"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                        className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                        required={!editingTeacher}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {(formData.password || !editingTeacher) && (
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-200">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                        }
                                        className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                        required={!editingTeacher || formData.password !== ""}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-200">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                                    style={{ backgroundColor: "#1e293b" }}
                                    className="border border-gray-300 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 [&>option]:bg-slate-800 [&>option]:text-white appearance-none"
                                >
                                    <option value="active" style={{ backgroundColor: "#1e293b", color: "white" }}>
                                        Active
                                    </option>
                                    <option value="inactive" style={{ backgroundColor: "#1e293b", color: "white" }}>
                                        Inactive
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-200">Subjects</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {availableSubjects.map((subject) => (
                                        <label
                                            key={subject}
                                            className="flex items-center space-x-2 p-2 transition-colors border rounded cursor-pointer hover:text-black hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.subjects.includes(subject)}
                                                onChange={() => handleSubjectToggle(subject)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{subject}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingTeacher(null)
                                    resetForm()
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-accent rounded-md hover:text-black"
                            >
                                {editingTeacher ? "Update" : "Create"} Teacher
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="p-6 border border-slate-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-white capitalize">{teacher.name}</h3>
                                <p className="text-sm text-slate-300">{teacher.email}</p>
                                <p className="text-sm mt-2">
                                    <span className="text-slate-300 mr-2">Status:</span>
                                    <span
                                        className={`px-2 py-1 rounded-full  capitalize ${
                                            teacher.status === "active"
                                                ? "bg-green-900 text-green-200"
                                                : "bg-red-900 text-red-200"
                                        }`}
                                    >
                                        {teacher.status || "active"}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => handleEdit(teacher)}
                                className="p-1 text-slate-300 hover:text-slate-50"
                                title="Edit Teacher"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Subjects:</h4>
                            <div className="flex flex-wrap gap-2">
                                {teacher.subjects.map((subject) => (
                                    <span
                                        key={subject}
                                        className="px-2 py-1 text-xs font-medium text-primary bg-accent/80 rounded-full"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
