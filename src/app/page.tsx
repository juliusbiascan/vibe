import { prisma } from '@/lib/db';

const Page = async () => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  return (
    <main>
      <h1 className="text-4xl font-bold">Welcome to Vibe</h1>
      <p className="mt-4">Your one-stop solution for all things productivity.</p>
      {users.map((user) => (
        <div key={user.id} className="mt-6 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <div className="mt-4">
            <h3 className="text-xl font-medium">Posts:</h3>
            {user.posts.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.posts.map((post) => (
                  <li key={post.id}>
                    <strong>{post.title}</strong>: {post.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default Page;