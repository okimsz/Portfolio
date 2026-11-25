import { useEffect, useRef } from 'react';
import { X, Github, ExternalLink, Download, Mail, Phone, MapPin, Code2, Layers, Cpu } from 'lucide-react';
import { profile, projects, sections, education, skillGroups, experience } from '../data';

export default function PortfolioModal({ section, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    function key(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const items = ref.current.querySelectorAll('button,a[href]');
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); previous?.focus(); };
  }, [section, onClose]);
  if (!section) return null;
  const info = sections[section];
  return <div className="modal-backdrop" onClick={onClose}>
    <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="panel-title" className="portfolio-panel" onClick={e => e.stopPropagation()}>
      <button className="close-button icon-button" aria-label="Close panel" onClick={onClose}><X size={21} /></button>
      <p className="eyebrow">{info.eyebrow}</p><h2 id="panel-title">{info.title}</h2><p className="panel-intro">{info.description}</p>
      {section === 'projects' && <div className="project-list">{projects.map((p, i) => <article className="project-card" key={p.title}>
        <div className={'project-art ' + p.color}>{i === 0 ? <Layers size={43} /> : i === 1 ? <Cpu size={43} /> : <Code2 size={43} />}<span>{p.type}</span></div>
        <div className="project-copy"><h3>{p.title}</h3><p className="project-subtitle">{p.subtitle}</p><p className="project-dates">{p.dates}</p><p>{p.description}</p>
          <div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
          <div className="project-links">
            {p.demo && <a href={p.demo} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Live demo</a>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer"><Github size={15} /> Source code</a>}
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent('Tell me about ' + p.title)}`}><Mail size={15} /> Ask about this project</a>
          </div>
        </div>
      </article>)}</div>}
      {section === 'about' && <>
        <div className="about-card"><span className="avatar">{profile.initials}<span>✦</span></span><div><h3>{profile.name}</h3><p>{profile.role}</p></div></div>
        <div className="prose">{profile.bio.map(p => <p key={p}>{p}</p>)}</div>
        <div className="note-card">Based in <strong>{profile.location}</strong></div>
        <a className="primary-button" href={profile.resume} download><Download size={17} /> Download résumé</a>
      </>}
      {section === 'education' && <div className="timeline">
        <article><span className="timeline-mark">✦</span><p className="eyebrow">{education.date}</p><h3>{education.degree}</h3><p>{education.school}</p><p>{education.location}</p></article>
        <article><span className="timeline-mark">✧</span><p className="eyebrow">ACADEMIC HONORS</p>{education.honors.map(honor => <p key={honor} className="honor-item">{honor}</p>)}</article>
      </div>}
      {section === 'skills' && <>
        <div className="skill-groups">{Object.entries(skillGroups).map(([name, tags]) => <div key={name}><h3>{name}</h3><div className="tags">{tags.map(t => <span key={t}>{t}</span>)}</div></div>)}</div>
        <h3 className="experience-title">Experience so far</h3>
        <div className="timeline">{experience.map(job => <article key={job.company}>
          <span className="timeline-mark">⌘</span><p className="eyebrow">{job.dates}</p><h3>{job.title}</h3><p className="company-name">{job.company}</p>
          {job.details.map(detail => <p key={detail}>{detail}</p>)}
        </article>)}</div>
      </>}
      {section === 'contact' && <>
        <div className="contact-illustration">☺<span>Good things start with a hello.</span></div>
        <a className="primary-button" href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
        <div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={19} /> GitHub</a><a href={`tel:${profile.telephone}`}><Phone size={18} /> {profile.phone}</a></div>
        <p className="contact-location"><MapPin size={16} />{profile.location}</p>
      </>}
    </section>
  </div>;
}
