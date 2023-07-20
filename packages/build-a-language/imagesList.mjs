import fs from 'fs/promises';

const imagesDir = await fs.readdir('./public/images');

const images = imagesDir.map((file) => `  '${file}'`);

const data = `const data = [
${images.join(',\n')}
];

export default data;
`;

fs.writeFile('./src/applications/preferences/data.js', data);
