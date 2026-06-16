"use client"

import { useActionState, useState } from "react"
import { createCourse, updateCourse } from "@/app/admin/actions"

type Course = {
  id: string
  slug: string
  title: string
  spanish_title: string | null
  description: string | null
  icon: string | null
  is_free: boolean
  is_published: boolean
  sort_order: number
}

type State = { ok: boolean; message: string }
const initial: State = { ok: false, message: "" }

const fieldCls =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none"

export function CreateCourseForm() {
  const [state, action, pending] = useActionState(createCourse, initial)
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#15803D]"
      >
        + New course
      </button>
    )
  }

  return (
    <form action={action} className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-bold text-[#0D2B45]">Create a new course</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Title (English)</label>
          <input name="title" required className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Title (Spanish)</label>
          <input name="spanish_title" className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Slug</label>
          <input name="slug" required placeholder="general-knowledge" className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Icon (emoji/text)</label>
          <input name="icon" className={fieldCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Description</label>
          <textarea name="description" rows={2} className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Sort order</label>
          <input name="sort_order" type="number" defaultValue={0} className={fieldCls} />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm text-[#0D2B45]">
            <input name="is_free" type="checkbox" /> Free
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0D2B45]">
            <input name="is_published" type="checkbox" defaultChecked /> Published
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white hover:bg-[#15803D] disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create course"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-500">
          Cancel
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-[#16A34A]" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  )
}

export function EditCourseRow({ course }: { course: Course }) {
  const [state, action, pending] = useActionState(updateCourse, initial)
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-bold text-[#0D2B45]">{course.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                course.is_published ? "bg-green-100 text-[#16A34A]" : "bg-gray-100 text-gray-500"
              }`}
            >
              {course.is_published ? "Published" : "Draft"}
            </span>
            {course.is_free && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-[#1E4D8C]">
                Free
              </span>
            )}
          </div>
          <p className="truncate text-sm text-gray-500">
            /{course.slug} · order {course.sort_order}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`/courses/${course.slug}`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-[#0D2B45] hover:bg-gray-50"
          >
            View
          </a>
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-[#1E4D8C] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#163d6e]"
          >
            Edit
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-xl border border-[#1E4D8C] bg-white p-4">
      <input type="hidden" name="id" value={course.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Title (English)</label>
          <input name="title" defaultValue={course.title} required className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Title (Spanish)</label>
          <input name="spanish_title" defaultValue={course.spanish_title ?? ""} className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Icon</label>
          <input name="icon" defaultValue={course.icon ?? ""} className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Sort order</label>
          <input name="sort_order" type="number" defaultValue={course.sort_order} className={fieldCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Description</label>
          <textarea name="description" defaultValue={course.description ?? ""} rows={2} className={fieldCls} />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm text-[#0D2B45]">
            <input name="is_free" type="checkbox" defaultChecked={course.is_free} /> Free
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0D2B45]">
            <input name="is_published" type="checkbox" defaultChecked={course.is_published} /> Published
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white hover:bg-[#15803D] disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-sm font-semibold text-gray-500">
          Cancel
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-[#16A34A]" : "text-red-600"}`}>{state.message}</p>
        )}
      </div>
    </form>
  )
}
