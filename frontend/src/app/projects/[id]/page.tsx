import { mockProjects } from '@/lib/data';
import ProjectClientPage from './ProjectClientPage';

// Эта функция говорит Next.js, какие ID нужно сгенерировать при билде (npm run build)
export async function generateStaticParams() {
    return mockProjects.map((project) => ({
        id: project.id,
    }));
}

// Указываем, что динамические параметры запрещены при static export
export const dynamicParams = false;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ProjectClientPage params={params} />;
}
