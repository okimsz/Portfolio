import { useState } from 'react';
import { Snowflake, House, Sun, ExternalLink, Github, FlaskConical } from 'lucide-react';
import { playground } from '../data';
const icons = [Snowflake, House, Sun];

export default function PlaygroundPanel({ initialProject }) {
  const [selected, setSelected] = useState(initialProject || playground[0].id);
  const project = playground.find(p => p.id === selected) || playground[0];
  return <div className="playground-content">
    <div className="experiment-picker" role="group" aria-label="Choose an experiment">
      {playground.map((p,i) => {const Icon=icons[i];return <button key={p.id} aria-pressed={project.id===p.id} onClick={() => setSelected(p.id)}><Icon size={23}/><strong>{p.name}</strong><span>{p.shortTitle}</span></button>;})}
    </div>
    <article className="experiment-card" key={project.id}>
      <a className="experiment-preview" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Launch ${project.name} demo (opens in a new tab)`}>
        <img src={project.image} alt={`${project.name} live application interface`} width="1200" height="800" />
        <span><ExternalLink size={14}/> Explore the live demo</span>
      </a>
      <div className="experiment-copy"><p className="eyebrow">INTERACTIVE ENGINEERING LAB</p><h3>{project.name}<span> / {project.title}</span></h3><p>{project.description}</p>
        <div className="experiment-prompt"><FlaskConical size={20}/><div><strong>Try this experiment</strong><p>{project.prompt}</p></div></div>
        <div className="tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div>
        <a className="primary-button" href={project.demo} target="_blank" rel="noopener noreferrer"><ExternalLink size={17}/> Launch interactive demo</a>
        <a className="experiment-source" href={project.github} target="_blank" rel="noopener noreferrer"><Github size={16}/> View source on GitHub</a>
        <p className="experiment-note">Opens in a new tab. Your room stays right here.</p>
      </div>
    </article>
  </div>;
}
