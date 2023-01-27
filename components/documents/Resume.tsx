import { ComponentChildren } from "preact/src/index";

// document visual settings
let main_color = "gray";

const document_data = {
  // header
  my_name: "Kozlov Maxim",
  position: "Junior Developer",
  contacts: [
    { type: "Tel", value: "+7 705 312 2714" },
    { type: "Email", value: "kozlov.maxim.m@gmail.com" },
    { type: "Telegram", value: "kozlovmaximm" },
    { type: "Discord", value: "Sebekerga#0009" },
  ],
  header_comment:
    "I am interested in programming, prototyping and electronics, seek new knowledge and experience in various IT spheres in my free time, while trying to grow my competence as a professional software developer",
  
  // work exp
  work_experience: [
    {
      label: "Robotics teacher, Лига роботов",
      sub_label: "Nov 2021 — Feb 2022",
      content:
        "I was teaching basics of robot prototyping and programming for teenagers and preschool students",
    },
    {
      label: "1C + Backend, FreeSolutions",
      sub_label: "May 2022 — Present, Remote",
      content:
        "Aside from standard 1C developer's tasks, I worked solo on a backend services like CRM telegram bot and version control system based on GitLab",
    },
  ] as CVElementProps[],
  
  // public projects
  public_projects_experience: [
    {
      label: "UI Game Developer, BF3: Reality Mod",
      sub_label: "Sep 2022 — Present, Remote",
      content: "Part time volunteering as a UI Developer for a community made rework of the original BF3",
    },
  ] as CVElementProps[],
  
  // certificates
  certificates: [
    {
      label: "Full Stack Open 2022",
      content:
        "A big and detailed, yearly updated course on modern web apps and backend dev with focus on making a stable and manageable apps",
      link: { label: "fullstackopen.com", content: "https://fullstackopen.com/en/" },
    },
  ] as CVElementProps[],
  
  // skills
  skill_bubbles: [
    {
      label: "Languages",
      data: ["Typescript", "Python", "SQL"],
    },
    {
      label: "Technologies",
      data: ["Deno", "REST", "Express", "React", "Vue", "Tailwind", "Fusion 360", "Blender"],
    },
    {
      label: "Software Development",
      data: ["git", "SVN", "Linux", "OOP", "Docs"],
    },
    {
      label: "Other hard skills",
      data: ["3D modeling and prototyping", "3D rendering", "Moderate electronics knowledge"],
    },
    {
      label: "Soft Skills",
      data: ["Fluent English", "Self learning", "Quality code"],
    },
  ] as BubblesProps[],
  skills_detailed: [
    "I am capable of modifying, debugging and keeping code nice in C++, Java, JS, TS, Python and SQL,",
    "Can read and quickly grasp documentation for software and hardware,",
    // "Knowledge of algorithms and data structures,",
    // "Understanding of what makes good, readable, reusable and understandable code,",
    "Last year bachelor in Robotics at ITMO University, unfortunately had to drop out due to urgent emigration,",
  ],
  
  // personal projects
  personal_projects: [
    {
      label: "Nonograms",
      sub_label: "React/Redux + Express",
      // content: "Nonogram puzzle client made in Win95 style made with React and a backend on express",
      content: "",
      link: {
        label: "github.com/Sebekerga/nonograms95",
        content: "https://github.com/Sebekerga/nonograms95",
      },
    },
  ] as CVElementProps[],
  
  source_link: "https://play.tailwindcss.com/120CIGIEl9",

}


interface BubbleContainerProps {
  children: ComponentChildren;
  label?: string;
}
const BubbleContainer = (props: BubbleContainerProps) => {
  return (
    <div class="mt-[5mm] flex-1 rounded-[5mm] bg-white p-[5mm] shadow-lg">
      {props.label && (
        <h2 class={`text-[5.75mm] font-bold uppercase text-${main_color}-600`}>{props.label}</h2>
      )}
      {props.children}
    </div>
  );
};

interface BubblesProps {
  data: Array<string>;
  label?: string;
}
const Bubbles = (props: BubblesProps) => {
  return (
    <div>
      {props.label && (
        <h3 class="ml-[2mm] mt-[1mm] mb-[-1mm] text-[4.5mm] italic text-gray-800">
          {props.label}:
        </h3>
      )}
      <div class="flex flex-wrap">
        {props.data.map((bubble_label) => (
          <p
            class={`mr-[2mm] mt-[1mm] whitespace-nowrap rounded-full bg-${main_color}-500 pt-[1mm] pb-[0.3mm] pl-[2.5mm] pr-[2.5mm] text-[3.5mm] font-bold text-white shadow-sm`}
          >
            {bubble_label}
          </p>
        ))}
      </div>
    </div>
  );
};

interface CVElementProps {
  label: string;
  content: string;
  sub_label?: string;
  link?: {
    label: string;
    content: string;
  };
}
const CVElement = (props: CVElementProps) => {
  return (
    <div class="mt-[2.5mm]">
      <h3 class="text-[5mm] font-bold text-gray-800">{props.label}</h3>
      {props.sub_label && <h4 class="mt-[-2mm] text-[5mm] text-gray-800">{props.sub_label}</h4>}
      <p class="ml-[3mm] text-[4mm] text-gray-900 text-justify">{props.content}</p>

      {props.link && (
        <p class="ml-[3mm] inline-flex text-gray-900 hover:text-blue-700">
          <span>@</span>
          <a
            class="ml-[1mm] h-full text-[mm] underline"
            href={props.link.content}
          >
            {props.link.label}
          </a>
        </p>
      )}
    </div>
  );
};

interface ResumeProps {
  color?: string;
  profile_picture?: string;
}
const ResumePage = (props: ResumeProps) => {
  main_color = props.color || main_color;

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300&display=swap"
        rel="stylesheet"
      />
      <div class="flex h-[297mm] w-[210mm] flex-col bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
        {/* Header */}
        <div
          class={`ml-[15mm] mr-[15mm] rounded-b-[5mm] bg-gradient-to-b from-${main_color}-400 to-${main_color}-600 pt-[5mm] pb-[5mm] pl-[10mm] pr-[10mm] shadow-lg`}
        >
          <div class="flex">
            <img
              src={props.profile_picture || "/me/main.jpg"}
              class="h-[40mm] w-[40mm] rounded-full border-[0.8mm] border-solid border-white bg-white object-cover align-middle"
            />
            <div class="flex flex-1 flex-col pt-[6mm] pl-[5mm] align-middle">
              <a class="mb-[-2mm] text-[8mm] font-bold uppercase text-gray-100">{document_data.my_name}</a>
              <a class="text-[6mm] text-white">{document_data.position}</a>
            </div>
            <div class="flex flex-col pt-[7.2mm] pl-[5mm] align-middle">
              <a class="text-[5mm] text-white">
                <b class="uppercase">Contacts</b>
              </a>
              <ul>
                {document_data.contacts.map((item) => (
                  <li class="text-[3.5mm] text-white">
                    <b class="mr-[2mm]">{item.type}:</b>
                    {item.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p class="mt-[5mm] text-justify text-[4mm] text-gray-100">
            {document_data.header_comment}
          </p>
        </div>

        {/* Bubbles */}
        <div class="flex flex-1 pl-[10mm] pr-[10mm]">
          <div class="flex-1 mr-[2.5mm]">
            <BubbleContainer label="Work experience">
              {document_data.work_experience.map((el) => <CVElement {...el} />)}
            </BubbleContainer>
            <BubbleContainer label="Public projects participation">
              {document_data.public_projects_experience.map((el) => <CVElement {...el} />)}
            </BubbleContainer>
            <BubbleContainer label="Certificates">
              {document_data.certificates.map((el) => <CVElement {...el} />)}
            </BubbleContainer>
          </div>
          <div class="flex-1 ml-[2.5mm]">
            <BubbleContainer label="Skills">
              {document_data.skill_bubbles.map((el) => <Bubbles {...el} />)}
              <ul class="mt-[3mm] list-['—'] pl-[4mm]">
                {document_data.skills_detailed.map((el) => (
                  <li class="text-justify text-[4mm] text-gray-900">
                    {el}
                  </li>
                ))}
              </ul>
            </BubbleContainer>
            <BubbleContainer label="Personal projects">
              {document_data.personal_projects.map((el) => <CVElement {...el} />)}
            </BubbleContainer>
          </div>
        </div>
        <a
          class="mb-[3mm] text-center text-[5mm] text-gray-500"
          href={document_data.source_link}
        >
          ~ made with tailwind ~
        </a>
      </div>
    </div>
  );
};

export default ResumePage;
