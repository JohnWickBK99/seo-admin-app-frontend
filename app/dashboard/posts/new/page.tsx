import PostForm from "../PostForm";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
}
