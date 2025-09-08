interface Props {
  params: Promise<{
    projectsId: string
  }>;
}

const Page = async ({ params }: Props) => {

  const { projectsId } = await params;

  return (
    <div>
      <h1>Project ID: {projectsId}</h1>
    </div>
  );
}

export default Page;