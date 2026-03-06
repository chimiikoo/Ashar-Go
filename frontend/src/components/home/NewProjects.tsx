'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { mockProjects } from '@/lib/data';
import ProjectCard from '@/components/projects/ProjectCard';

export default function NewProjects() {
    const { t } = useLocale();

    const newProjects = mockProjects
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    return (
        <section style={{ padding: '60px 0', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                            {t.sections.newProjects}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Недавно добавленные проекты</p>
                        <div style={{ width: '40px', height: '3px', background: '#a3e635', borderRadius: '4px' }} />
                    </motion.div>

                    <Link
                        href="/projects?sort=newest"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#a3e635', textDecoration: 'none', fontWeight: 600 }}
                    >
                        {t.sections.allProjects}
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </Link>
                </div>

                <style>{`
                    .new-projects-grid {
                        display: grid;
                        gap: 12px;
                        grid-template-columns: repeat(2, 1fr);
                    }
                    @media (min-width: 768px) {
                        .new-projects-grid {
                            grid-template-columns: repeat(4, 1fr);
                            gap: 20px;
                        }
                    }
                `}</style>

                <div className="new-projects-grid">
                    {newProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} compact />
                    ))}
                </div>
            </div>
        </section>
    );
}
