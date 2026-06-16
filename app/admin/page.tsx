import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/auth'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) redirect('/courses')

  async function createCourse(formData: FormData) {
    'use server'
    const server = await createClient()
    const { data: { user } } = await server.auth.getUser()
    if (!isAdminEmail(user?.email)) return

    await server.from('courses').insert({
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      content: String(formData.get('content')),
      video_url: String(formData.get('video_url')),
      resource_url: String(formData.get('resource_url')),
      sort_order: Number(formData.get('sort_order') || 0),
      is_published: formData.get('is_published') === 'on'
    })
  }

  async function toggleCourse(formData: FormData) {
    'use server'
    const server = await createClient()
    const { data: { user } } = await server.auth.getUser()
    if (!isAdminEmail(user?.email)) return

    const id = String(formData.get('id'))
    const isPublished = String(formData.get('is_published')) === 'true'

    await server.from('courses').update({ is_published: !isPublished }).eq('id', id)
  }

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <main className="dashboard">
      <div className="container">
        <div className="kicker">Admin</div>
        <h1>Course manager.</h1>

        <form className="form" action={createCourse}>
          <h2>Create lesson</h2>
          <label>Title</label>
          <input className="input" name="title" required />
          <label>Description</label>
          <textarea className="textarea" name="description" required />
          <label>Static lesson content</label>
          <textarea className="textarea" name="content" />
          <label>Video URL</label>
          <input className="input" name="video_url" placeholder="https://..." />
          <label>Resource URL</label>
          <input className="input" name="resource_url" placeholder="https://..." />
          <label>Sort order</label>
          <input className="input" name="sort_order" type="number" defaultValue="0" />
          <label><input name="is_published" type="checkbox" defaultChecked /> Published</label>
          <br /><br />
          <button className="btn" type="submit">Create lesson</button>
        </form>

        <section className="panel" style={{ marginTop: 24 }}>
          <h2>Existing lessons</h2>
          <table className="table">
            <thead>
              <tr><th>Order</th><th>Title</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {(courses || []).map((course: { id: string; sort_order: number; title: string; is_published: boolean }) => (
                <tr key={course.id}>
                  <td>{course.sort_order}</td>
                  <td>{course.title}</td>
                  <td>{course.is_published ? 'Published' : 'Draft'}</td>
                  <td>
                    <form action={toggleCourse}>
                      <input type="hidden" name="id" value={course.id} />
                      <input type="hidden" name="is_published" value={String(course.is_published)} />
                      <button className="btn secondary" type="submit">
                        {course.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}
