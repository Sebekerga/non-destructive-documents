import { DocumentDescription, fileToBase64 } from "../utils/documents.ts";

// document visual settings
let main_color = "gray";

interface DenoResumePageProps {
  color?: string;
}

const media = {
  image: await fileToBase64("documents/media/deno.svg"),
  discord_logo: await fileToBase64("documents/media/radix_icons/discord-logo.svg"),
  github_logo: await fileToBase64("documents/media/radix_icons/github-logo.svg"),
  website_logo: await fileToBase64("documents/media/radix_icons/globe.svg"),
};

const DenoResumePage = (props: DenoResumePageProps) => {
  main_color = props.color || main_color;
  return (
    <div
      class={`flex h-[297mm] w-[210mm] flex-col bg-gradient-to-br from-gray-100 to-${main_color}-100 font-sans`}
    >
      {/* Header */}
      <div
        class={`flex p-[5mm] mx-[20mm] mt-[10mm] bg-${main_color}-300 rounded-[10mm] shadow-2xl text-black`}
        style={{ "boxShadow": `0 1mm 6mm 6mm ${main_color}` }}
      >
        <div class="flex-1">
          <h2 class="pt-[8mm] text-[10mm] font-bold">
            Deno Dino
          </h2>
          <h3 class="text-[7mm]">
            Junior Developer
          </h3>
        </div>
        <img
          class="w-[50mm] h-[50mm] bg-white rounded-1/2"
          src={`data:image/svg+xml;base64,${media.image}`}
        />
        <div class="flex-1 mt-[6mm]">
          <ul class="ml-[5mm]">
            <li class="flex items-center">
              <img class="h-[8mm]" src={`data:image/svg+xml;base64,${media.github_logo}`} />
              <p class="text-[8mm] pl-[2mm]">denoland</p>
            </li>
            <li class="flex items-center">
              <img class="h-[8mm]" src={`data:image/svg+xml;base64,${media.discord_logo}`} />
              <p class="text-[8mm] pl-[2mm]">deno</p>
            </li>
            <li class="flex items-center">
              <img class="h-[8mm]" src={`data:image/svg+xml;base64,${media.website_logo}`} />
              <p class="text-[8mm] pl-[2mm]">deno.land</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex p-[4mm] mt-[20mm]">
        <div class="flex-1">
          <div
            class="bg-white mx-[12mm] mb-[16mm] p-[2mm] rounded-[3mm]"
            style={{ "boxShadow": `0 0 15mm 2mm ${main_color}` }}
          >
            <h2 class="text-[7mm] uppercase">lacus viverra</h2>
            <p class="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi scelerisque eu. A
              lacus vestibulum sed arcu non. Feugiat in fermentum posuere urna nec tincidunt praesent semper
              feugiat.
            </p>
          </div>
          <div
            class="bg-white mx-[12mm] mb-[16mm] p-[2mm] rounded-[3mm]"
            style={{ "boxShadow": `0 0 15mm 2mm ${main_color}` }}
          >
            <h2 class="text-[7mm] uppercase">vitae congue</h2>
            <p class="text-justify">
              Sit amet luctus venenatis lectus magna fringilla urna porttitor. Eget est lorem ipsum dolor sit.
              Venenatis a condimentum vitae sapien pellentesque. Nisl nunc mi ipsum faucibus vitae aliquet nec
              ullamcorper sit. Consectetur adipiscing elit ut aliquam purus sit amet. Nisi porta lorem mollis
              aliquam ut porttitor leo a diam. Sit amet consectetur adipiscing elit ut. Magnis dis parturient
              montes nascetur ridiculus. Nulla facilisi etiam dignissim diam quis. In arcu cursus euismod quis
              viverra nibh cras pulvinar.
            </p>
          </div>
        </div>
        <div class="flex-1">
          <div
            class="bg-white mx-[12mm] mb-[16mm] p-[2mm] rounded-[3mm]"
            style={{ "boxShadow": `0 0 15mm 2mm ${main_color}` }}
          >
            <h2 class="text-[7mm] uppercase">eu consequat</h2>
            <p class="text-justify">
              Ultricies mi quis hendrerit dolor magna eget est lorem. Neque viverra justo nec ultrices dui
              sapien. Condimentum mattis pellentesque id nibh tortor id. Platea dictumst quisque sagittis
              purus sit amet volutpat consequat mauris. Senectus et netus et malesuada fames. Turpis egestas
              integer eget aliquet nibh praesent tristique. Praesent tristique magna sit amet purus gravida
              quis. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Tempor orci dapibus
              ultrices in iaculis nunc sed augue lacus. Consequat nisl vel pretium lectus quam id. Diam quis
              enim lobortis scelerisque fermentum dui faucibus in.
            </p>
          </div>
          <div
            class="bg-white mx-[12mm] mb-[16mm] p-[2mm] rounded-[3mm]"
            style={{ "boxShadow": `0 0 15mm 2mm ${main_color}` }}
          >
            <h2 class="text-[7mm] uppercase">ac felis</h2>
            <p class="text-justify">
              Mi eget mauris pharetra et ultrices neque ornare. Eu consequat ac felis donec et odio
              pellentesque diam volutpat. Nunc congue nisi vitae suscipit. Urna condimentum mattis
              pellentesque id nibh tortor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const document_description: DocumentDescription = {
  label: "Resume",
  document_id: "resume",
  filename: "deno_resume",
  pages: [
    <DenoResumePage color="lightgreen" />, // deno resume for sharing online
    <DenoResumePage color="gray" />, // deno resume for printing
  ],
};

export default document_description;
