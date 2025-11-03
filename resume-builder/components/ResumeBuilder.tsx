"use client";

import React, { useMemo, useState } from "react";

type PersonalInfo = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
};

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

type Education = {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
  location: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
  highlights: string[];
};

type SkillBlock = {
  id: string;
  label: string;
  items: string;
};

type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  tips: string[];
};

const basePersonalInfo: PersonalInfo = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  summary: "",
};

const roleSuggestionLibrary: Array<{
  pattern: RegExp;
  bullets: string[];
}> = [
  {
    pattern: /(software|full\s*stack|backend|frontend|web|developer|engineer)/i,
    bullets: [
      "Designed and shipped responsive interfaces with React, TypeScript, and modern CSS tooling.",
      "Collaborated with cross-functional partners to ship features that unblocked revenue-critical workflows.",
      "Instrumented analytics and alerting that reduced production issues and improved deployment confidence.",
    ],
  },
  {
    pattern: /(product\s*manager|pm|product lead)/i,
    bullets: [
      "Defined product strategy by synthesizing user research, analytics, and stakeholder interviews.",
      "Launched iterative experiments that increased activation and retention across the customer lifecycle.",
      "Prioritized developer time through a discovery-to-delivery framework grounded in measurable outcomes.",
    ],
  },
  {
    pattern: /(designer|ux|ui)/i,
    bullets: [
      "Crafted accessible design systems with documented patterns and component libraries.",
      "Conducted moderated usability sessions that surfaced critical workflow friction.",
      "Partnered with engineers to validate interaction fidelity and deliver pixel-perfect implementations.",
    ],
  },
  {
    pattern: /(data|analytics|science)/i,
    bullets: [
      "Delivered end-to-end data products leveraging Python, SQL, and BI tooling to answer high-impact questions.",
      "Built predictive models that increased operational efficiency and informed strategic decisions.",
      "Implemented automated data quality monitors that strengthened trust in dashboards and reports.",
    ],
  },
];

const getSuggestedBullets = (role: string, summary: string) => {
  const libraryMatches = roleSuggestionLibrary
    .filter((entry) => entry.pattern.test(role) || entry.pattern.test(summary))
    .flatMap((entry) => entry.bullets);

  const genericBullets = [
    "Partnered with stakeholders to prioritize initiatives by impact and effort.",
    "Applied measurable goals to track success and iterate quickly on feedback.",
    "Mentored teammates and strengthened team operating rituals to raise the quality bar.",
  ];

  return [...new Set([...libraryMatches, ...genericBullets])];
};

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const createExperience = (): Experience => ({
  id: generateId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [],
});

const createEducation = (): Education => ({
  id: generateId(),
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
  details: "",
  location: "",
});

const createProject = (): Project => ({
  id: generateId(),
  name: "",
  description: "",
  link: "",
  highlights: [],
});

const createSkillBlock = (): SkillBlock => ({
  id: generateId(),
  label: "",
  items: "",
});

const ChecklistPanel = ({
  checklist,
}: {
  checklist: ChecklistItem[];
}) => {
  const complete = checklist.every((item) => item.satisfied);
  const completedCount = checklist.filter((item) => item.satisfied).length;

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
      <header className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Builder Agent
          </p>
          <h2 className="text-xl font-semibold text-zinc-900">
            {complete
              ? "Resume looks deployment-ready"
              : "Guidance to strengthen your resume"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {completedCount} / {checklist.length} agent checkpoints satisfied.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            complete
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {complete ? "Complete" : "In progress"}
        </span>
      </header>
      <ol className="space-y-3">
        {checklist.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border px-4 py-3 ${
              item.satisfied
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  item.satisfied
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {item.satisfied ? "✓" : "!"}
              </span>
              <p className="text-sm font-semibold text-zinc-900">
                {item.label}
                {!item.required && (
                  <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    Bonus
                  </span>
                )}
              </p>
            </div>
            {!item.satisfied && (
              <ul className="mt-3 space-y-1 text-xs text-zinc-600">
                {item.tips.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

const ResumePreview = ({
  personal,
  experiences,
  educations,
  projects,
  skills,
}: {
  personal: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: SkillBlock[];
}) => {
  return (
    <article className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-10 shadow-2xl shadow-emerald-900/5 print:rounded-none print:border-0 print:shadow-none print:p-0">
      <header className="space-y-2 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="text-lg font-semibold text-zinc-700">
          {personal.headline || "Role • Industry"}
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600">
          {[personal.email, personal.phone, personal.location]
            .filter(Boolean)
            .map((value) => (
              <li key={value}>{value}</li>
            ))}
          {[personal.website, personal.linkedin]
            .filter(Boolean)
            .map((value) => (
              <li key={value}>
                <a
                  href={value.startsWith("http") ? value : `https://${value}`}
                  className="text-emerald-600 underline hover:text-emerald-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  {value.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
        </ul>
        {personal.summary && (
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">
            {personal.summary}
          </p>
        )}
      </header>

      {experiences.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold uppercase tracking-wide text-zinc-500">
            Experience
          </h2>
          <ul className="space-y-5">
            {experiences.map((exp) => (
              <li key={exp.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-zinc-900">
                      {exp.role || "Role Title"}
                    </p>
                    <p className="text-sm font-medium text-zinc-600">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="space-y-2 text-sm text-zinc-600">
                    {exp.bullets.map((bullet, index) => (
                      <li key={`${exp.id}-${index}`} className="flex gap-2">
                        <span>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold uppercase tracking-wide text-zinc-500">
            Projects
          </h2>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-base font-semibold text-zinc-900">
                    {project.name || "Project Name"}
                  </p>
                  {project.link && (
                    <a
                      href={
                        project.link.startsWith("http")
                          ? project.link
                          : `https://${project.link}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-700"
                    >
                      View Live
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-zinc-600">{project.description}</p>
                )}
                {project.highlights.length > 0 && (
                  <ul className="space-y-1 text-sm text-zinc-600">
                    {project.highlights.map((highlight, index) => (
                      <li key={`${project.id}-${index}`} className="flex gap-2">
                        <span>•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {educations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold uppercase tracking-wide text-zinc-500">
            Education
          </h2>
          <ul className="space-y-4">
            {educations.map((edu) => (
              <li key={edu.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-zinc-900">
                      {edu.school || "School"}
                    </p>
                    <p className="text-sm font-medium text-zinc-600">
                      {edu.degree}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
                {edu.details && (
                  <p className="text-sm text-zinc-600">{edu.details}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold uppercase tracking-wide text-zinc-500">
            Skills
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((block) => (
              <div
                key={block.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                  {block.label || "Category"}
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  {block.items || "Bullet, separated, skills"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

const SectionHeader = ({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: React.ReactNode;
}) => (
  <header className="flex flex-col gap-2 border-b border-zinc-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
    {cta}
  </header>
);

const Field = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="flex flex-col gap-1 text-sm text-zinc-700">
    <span className="font-medium text-zinc-900">{label}</span>
    <input
      {...props}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
    />
  </label>
);

const TextAreaField = ({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <label className="flex flex-col gap-1 text-sm text-zinc-700">
    <span className="font-medium text-zinc-900">{label}</span>
    <textarea
      {...props}
      className="min-h-[90px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
    />
  </label>
);

export function ResumeBuilder() {
  const [personal, setPersonal] = useState<PersonalInfo>(basePersonalInfo);
  const [experiences, setExperiences] = useState<Experience[]>([
    createExperience(),
  ]);
  const [educations, setEducations] = useState<Education[]>([
    createEducation(),
  ]);
  const [projects, setProjects] = useState<Project[]>([createProject()]);
  const [skills, setSkills] = useState<SkillBlock[]>([
    { id: generateId(), label: "Core", items: "" },
  ]);

  const checklist = useMemo<ChecklistItem[]>(() => {
    return [
      {
        id: "contact",
        label: "Contact section is complete",
        required: true,
        satisfied:
          personal.fullName.trim().length > 0 &&
          personal.headline.trim().length > 0 &&
          personal.email.trim().length > 0 &&
          personal.location.trim().length > 0,
        tips: [
          "Include full name, role headline, and location.",
          "Add best contact email and optional phone number.",
        ],
      },
      {
        id: "summary",
        label: "Include a focused summary",
        required: false,
        satisfied: personal.summary.trim().length > 60,
        tips: [
          "Write 2–3 concise sentences highlighting domain expertise.",
          "Reference years of experience and a core differentiator.",
        ],
      },
      {
        id: "experience",
        label: "At least one experience entry has impact bullets",
        required: true,
        satisfied: experiences.some((exp) => exp.bullets.length >= 3),
        tips: [
          "Aim for 3+ quantified bullets per recent role.",
          "Start each bullet with strong action verbs.",
        ],
      },
      {
        id: "education",
        label: "Education contains degree or certification",
        required: false,
        satisfied: educations.some(
          (edu) => edu.degree.trim().length > 0 || edu.details.trim().length > 0,
        ),
        tips: [
          "List degree, major, and graduation year.",
          "Add standout coursework, honors, or certifications.",
        ],
      },
      {
        id: "skills",
        label: "Skill blocks highlight tools and strengths",
        required: true,
        satisfied: skills.some((block) => block.items.trim().length > 0),
        tips: [
          "Group skills by tooling, methodologies, and domains.",
          "Mirror keywords used in your target job descriptions.",
        ],
      },
    ];
  }, [personal, experiences, educations, skills]);

  const handleExperienceChange = (
    id: string,
    updates: Partial<Experience>,
  ) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    );
  };

  const handleEducationChange = (id: string, updates: Partial<Education>) => {
    setEducations((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    );
  };

  const handleProjectChange = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      ),
    );
  };

  const handleSkillChange = (id: string, updates: Partial<SkillBlock>) => {
    setSkills((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block)),
    );
  };

  const exportAsJson = () => {
    if (typeof window === "undefined") return;
    const json = JSON.stringify(
      { personal, experiences, educations, projects, skills },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-builder-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printable = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return (
    <div className="grid min-h-screen gap-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-10 print:block print:bg-white sm:px-8 lg:grid-cols-[420px_minmax(0,1fr)_340px] lg:gap-8">
      <div className="space-y-6 no-print">
        <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-emerald-900/5">
          <SectionHeader
            title="Personal narrative"
            description="Anchor your resume with a memorable opener."
          />
          <div className="grid gap-4">
            <Field
              label="Full name"
              value={personal.fullName}
              onChange={(event) =>
                setPersonal((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              placeholder="Ada Lovelace"
            />
            <Field
              label="Headline"
              value={personal.headline}
              onChange={(event) =>
                setPersonal((prev) => ({
                  ...prev,
                  headline: event.target.value,
                }))
              }
              placeholder="Product-Focused Software Engineer"
            />
            <TextAreaField
              label="Summary"
              placeholder="3 sentences summarizing your superpower and domain focus."
              value={personal.summary}
              onChange={(event) =>
                setPersonal((prev) => ({
                  ...prev,
                  summary: event.target.value,
                }))
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                value={personal.email}
                onChange={(event) =>
                  setPersonal((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="ada@lovelace.dev"
              />
              <Field
                label="Phone"
                value={personal.phone}
                onChange={(event) =>
                  setPersonal((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
                placeholder="+44 07911 123456"
              />
              <Field
                label="Location"
                value={personal.location}
                onChange={(event) =>
                  setPersonal((prev) => ({
                    ...prev,
                    location: event.target.value,
                  }))
                }
                placeholder="London, UK (Hybrid)"
              />
              <Field
                label="Website"
                value={personal.website}
                onChange={(event) =>
                  setPersonal((prev) => ({
                    ...prev,
                    website: event.target.value,
                  }))
                }
                placeholder="portfolio.link"
              />
              <Field
                label="LinkedIn"
                value={personal.linkedin}
                onChange={(event) =>
                  setPersonal((prev) => ({
                    ...prev,
                    linkedin: event.target.value,
                  }))
                }
                placeholder="linkedin.com/in/adalovelace"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-emerald-900/5">
          <SectionHeader
            title="Experience designer"
            description="Detail the roles where you delivered measurable impact."
            cta={
              <button
                type="button"
                onClick={() =>
                  setExperiences((prev) => [...prev, createExperience()])
                }
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Add role
              </button>
            }
          />
          <div className="space-y-6">
            {experiences.map((exp) => {
              const suggestions = getSuggestedBullets(
                `${exp.role} ${exp.company}`,
                `${personal.summary}`,
              ).filter((bullet) => !exp.bullets.includes(bullet));

              return (
                <div
                  key={exp.id}
                  className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Role"
                      value={exp.role}
                      onChange={(event) =>
                        handleExperienceChange(exp.id, {
                          role: event.target.value,
                        })
                      }
                      placeholder="Senior Software Engineer"
                    />
                    <Field
                      label="Company"
                      value={exp.company}
                      onChange={(event) =>
                        handleExperienceChange(exp.id, {
                          company: event.target.value,
                        })
                      }
                      placeholder="Imperial Computing"
                    />
                    <Field
                      label="Location"
                      value={exp.location}
                      onChange={(event) =>
                        handleExperienceChange(exp.id, {
                          location: event.target.value,
                        })
                      }
                      placeholder="Remote"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Start"
                        value={exp.startDate}
                        onChange={(event) =>
                          handleExperienceChange(exp.id, {
                            startDate: event.target.value,
                          })
                        }
                        placeholder="Jan 2022"
                      />
                      <Field
                        label="End"
                        value={exp.endDate}
                        onChange={(event) =>
                          handleExperienceChange(exp.id, {
                            endDate: event.target.value,
                          })
                        }
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <TextAreaField
                    label="Impact bullets (one per line)"
                    placeholder="Launched..."
                    value={exp.bullets.join("\n")}
                    onChange={(event) =>
                      handleExperienceChange(exp.id, {
                        bullets: event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter((line) => line.length > 0),
                      })
                    }
                  />
                  {suggestions.length > 0 && (
                    <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Agent suggestions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.slice(0, 4).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() =>
                              handleExperienceChange(exp.id, {
                                bullets: [...exp.bullets, suggestion],
                              })
                            }
                            className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExperiences((prev) =>
                          prev.filter((item) => item.id !== exp.id),
                        )
                      }
                      className="text-xs font-semibold uppercase tracking-wide text-rose-500 hover:text-rose-600"
                    >
                      Remove role
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-emerald-900/5">
          <SectionHeader
            title="Projects storyteller"
            description="Showcase initiatives that illustrate creativity and ownership."
            cta={
              <button
                type="button"
                onClick={() => setProjects((prev) => [...prev, createProject()])}
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Add project
              </button>
            }
          />
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
              >
                <Field
                  label="Project name"
                  value={project.name}
                  onChange={(event) =>
                    handleProjectChange(project.id, {
                      name: event.target.value,
                    })
                  }
                  placeholder="Adaptive Resume Agent"
                />
                <TextAreaField
                  label="Description"
                  value={project.description}
                  onChange={(event) =>
                    handleProjectChange(project.id, {
                      description: event.target.value,
                    })
                  }
                  placeholder="Short narrative about why this mattered."
                />
                <Field
                  label="Link"
                  value={project.link}
                  onChange={(event) =>
                    handleProjectChange(project.id, {
                      link: event.target.value,
                    })
                  }
                  placeholder="https://project.link"
                />
                <TextAreaField
                  label="Highlights (one per line)"
                  value={project.highlights.join("\n")}
                  onChange={(event) =>
                    handleProjectChange(project.id, {
                      highlights: event.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    })
                  }
                />
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setProjects((prev) =>
                        prev.filter((item) => item.id !== project.id),
                      )
                    }
                    className="text-xs font-semibold uppercase tracking-wide text-rose-500 hover:text-rose-600"
                  >
                    Remove project
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-emerald-900/5">
          <SectionHeader
            title="Education credentials"
            description="Add degrees, certifications, and relevant programs."
            cta={
              <button
                type="button"
                onClick={() =>
                  setEducations((prev) => [...prev, createEducation()])
                }
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Add education
              </button>
            }
          />
          <div className="space-y-6">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
              >
                <Field
                  label="Institution"
                  value={edu.school}
                  onChange={(event) =>
                    handleEducationChange(edu.id, {
                      school: event.target.value,
                    })
                  }
                  placeholder="University of Computing"
                />
                <Field
                  label="Degree / Program"
                  value={edu.degree}
                  onChange={(event) =>
                    handleEducationChange(edu.id, {
                      degree: event.target.value,
                    })
                  }
                  placeholder="BSc Computer Science"
                />
                <TextAreaField
                  label="Highlights (one per line)"
                  value={edu.details}
                  onChange={(event) =>
                    handleEducationChange(edu.id, {
                      details: event.target.value,
                    })
                  }
                  placeholder="Dean's List • Coursework • Scholarships"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Start"
                    value={edu.startDate}
                    onChange={(event) =>
                      handleEducationChange(edu.id, {
                        startDate: event.target.value,
                      })
                    }
                    placeholder="2018"
                  />
                  <Field
                    label="End"
                    value={edu.endDate}
                    onChange={(event) =>
                      handleEducationChange(edu.id, {
                        endDate: event.target.value,
                      })
                    }
                    placeholder="2022"
                  />
                </div>
                <Field
                  label="Location"
                  value={edu.location}
                  onChange={(event) =>
                    handleEducationChange(edu.id, {
                      location: event.target.value,
                    })
                  }
                  placeholder="Oxford, UK"
                />
                {educations.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setEducations((prev) =>
                        prev.filter((item) => item.id !== edu.id),
                      )
                    }
                    className="text-xs font-semibold uppercase tracking-wide text-rose-500 hover:text-rose-600"
                  >
                    Remove education
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-emerald-900/5">
          <SectionHeader
            title="Skills curator"
            description="Group tools, methodologies, and domains."
            cta={
              <button
                type="button"
                onClick={() => setSkills((prev) => [...prev, createSkillBlock()])}
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Add block
              </button>
            }
          />
          <div className="space-y-6">
            {skills.map((block) => (
              <div
                key={block.id}
                className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
              >
                <Field
                  label="Label"
                  value={block.label}
                  onChange={(event) =>
                    handleSkillChange(block.id, {
                      label: event.target.value,
                    })
                  }
                  placeholder="Languages"
                />
                <TextAreaField
                  label="Skills (comma separated)"
                  value={block.items}
                  onChange={(event) =>
                    handleSkillChange(block.id, {
                      items: event.target.value,
                    })
                  }
                  placeholder="TypeScript, Next.js, PostgreSQL, GraphQL"
                />
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSkills((prev) =>
                        prev.filter((item) => item.id !== block.id),
                      )
                    }
                    className="text-xs font-semibold uppercase tracking-wide text-rose-500 hover:text-rose-600"
                  >
                    Remove block
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6 print:mt-0 print:block lg:sticky lg:top-8">
        <section className="no-print space-y-4 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-emerald-900/5">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Resume preview
              </p>
              <h2 className="text-xl font-semibold text-zinc-900">
                Live rendering
              </h2>
            </div>
            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <button
                type="button"
                onClick={printable}
                className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100"
              >
                Print / PDF
              </button>
              <button
                type="button"
                onClick={exportAsJson}
                className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100"
              >
                Export JSON
              </button>
            </div>
          </header>
          <p className="text-sm text-zinc-600">
            Polished layout optimized for quick recruiter scanning. View in
            print mode to generate a PDF.
          </p>
        </section>

        <ResumePreview
          personal={personal}
          experiences={experiences.filter(
            (exp) =>
              exp.role.trim().length > 0 || exp.company.trim().length > 0,
          )}
          educations={educations.filter(
            (edu) =>
              edu.school.trim().length > 0 || edu.degree.trim().length > 0,
          )}
          projects={projects.filter(
            (project) =>
              project.name.trim().length > 0 ||
              project.description.trim().length > 0,
          )}
          skills={skills.filter(
            (block) =>
              block.label.trim().length > 0 || block.items.trim().length > 0,
          )}
        />
      </div>

      <div className="space-y-6 no-print">
        <ChecklistPanel checklist={checklist} />
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/85 p-6 shadow-lg shadow-emerald-900/5">
          <header>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Agent heuristics
            </p>
            <h2 className="text-lg font-semibold text-zinc-900">
              Optimization insights
            </h2>
          </header>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li>
              • Mirror key words from target job description within your skills
              and bullet points.
            </li>
            <li>
              • Quantify impact with numbers, percentages, or scope to show
              scale.
            </li>
            <li>
              • Keep tense consistent: present for current role, past for
              previous roles.
            </li>
            <li>
              • Print mode renders a clean PDF — double-check spacing before
              submitting applications.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
