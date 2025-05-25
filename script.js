function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function addEntry(type) {
    const section = document.getElementById(`${type}-section`);
    const newEntry = document.createElement('div');
    newEntry.className = `${type}-entry entry-wrapper`;

    let innerHtml = '';
    if (type === 'education') {
        innerHtml = `
            <input placeholder="Degree (e.g., Bachelor of Technology)" class="w-full border px-2 py-1 rounded">
            <input placeholder="Institution/University" class="w-full border px-2 py-1 rounded">
            <input placeholder="Location" class="w-full border px-2 py-1 rounded">
            <input placeholder="Start Date" class="w-full border px-2 py-1 rounded">
            <input placeholder="End Date (or Present)" class="w-full border px-2 py-1 rounded">
            <input placeholder="GPA/Percentage" class="w-full border px-2 py-1 rounded">
        `;
    } else if (type === 'experience') {
        innerHtml = `
            <input placeholder="Role" class="w-full border px-2 py-1 rounded">
            <input placeholder="Company" class="w-full border px-2 py-1 rounded">
            <input placeholder="Location" class="w-full border px-2 py-1 rounded">
            <input placeholder="Start Date" class="w-full border px-2 py-1 rounded">
            <input placeholder="End Date (or Present)" class="w-full border px-2 py-1 rounded">
            <textarea placeholder="Responsibilities (one per line, will appear as bullet points)" class="w-full border px-2 py-1 rounded"></textarea>
        `;
    } else if (type === 'projects') {
        innerHtml = `
            <input placeholder="Project Name" class="w-full border px-2 py-1 rounded">
            <input placeholder="Start Date" class="w-full border px-2 py-1 rounded">
            <input placeholder="End Date (or Present)" class="w-full border px-2 py-1 rounded">
            <textarea placeholder="Description (one per line, will appear as bullet points)" class="w-full border px-2 py-1 rounded"></textarea>
            <input placeholder="Link (Optional)" class="w-full border px-2 py-1 rounded">
        `;
    } else if (type === 'certifications') {
        innerHtml = `
            <input placeholder="Certification Name" class="w-full border px-2 py-1 rounded">
        `;
    }

    newEntry.innerHTML = innerHtml + `<button type="button" onclick="deleteEntry(this)" class="text-red-500 text-sm">Remove</button>`;
    section.insertBefore(newEntry, section.lastElementChild);
    addInputListeners(newEntry); // Add listeners to new inputs
    updateProgressBar(); // Update progress bar after adding an entry
}

function deleteEntry(btn) {
    const entry = btn.closest('.entry-wrapper');
    if (entry) entry.remove();
    updateProgressBar(); // Update progress bar after deleting an entry
}

function generateResume() {
    const preview = document.getElementById("resume-preview");
    const name = document.getElementById("name").value;
    const jobTitle = document.getElementById("job-title").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;
    const linkedin = document.getElementById("linkedin").value;
    const github = document.getElementById("github").value;
    const summary = document.getElementById("summary-text").value;
    const skills = document.getElementById("skills").value; // This will now contain categories and skills
    const coursework = document.getElementById("coursework").value;

    function getEntries(selector) {
        return Array.from(document.querySelectorAll(selector)).map(entry => {
            const fields = Array.from(entry.querySelectorAll('input, textarea')).map(e => e.value.trim());
            return fields.filter(Boolean).length > 0 ? fields : null;
        }).filter(Boolean);
    }

    const educationEntries = getEntries('.education-entry');
    const experienceEntries = getEntries('.experience-entry');
    const projectEntries = getEntries('.projects-entry');
    const certificationEntries = getEntries('.certifications-entry');

    // Helper to format bullet points from textarea
    const formatBulletPoints = (text) => {
        if (!text) return '';
        const lines = text.split('\n').filter(line => line.trim() !== '');
        // Apply the new 'bullet-list' class here
        return `<ul class="bullet-list">${lines.map(line => `<li>${line.trim()}</li>`).join('')}</ul>`;
    };

    // Helper to format skills and coursework into tags/chips
    const formatTags = (text, typeClass) => {
        if (!text) return '';
        const items = text.split(',').map(item => item.trim()).filter(Boolean);
        return items.map(item => `<span class="${typeClass}">${item}</span>`).join('');
    };

    // Helper to format categorized skills
    const formatCategorizedSkills = (text) => {
        if (!text) return '';
        const lines = text.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const category = parts[0].trim();
                const skillsList = parts[1].split(',').map(s => s.trim()).filter(Boolean);
                return `
                    <div class="mb-1">
                        <span class="skill-category-title">${category}:</span>
                        ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                `;
            } else {
                return `<span class="skill-tag">${line.trim()}</span>`; // For uncategorized lines
            }
        }).join('');
    };

    let resumeHtml = `
        <div class="header-section text-center">
            <h2>${name.toUpperCase()}</h2>
            ${jobTitle ? `<p class="sub-title">${jobTitle}</p>` : ''}
            <div class="contact-info flex justify-center flex-wrap">
                ${phone ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.75-.25 1.02L6.62 10.79z"/></svg>${phone}</span>` : ''}
                ${email ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>${email}</span>` : ''}
                ${linkedin ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="${linkedin}" target="_blank">${linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/').replace(/\/$/, '')}</a></span>` : ''}
                ${github ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.08-.731.084-.716.084-.716 1.192.085 1.815 1.229 1.815 1.229 1.064 1.816 2.792 1.299 3.465.996.108-.775.418-1.299.762-1.59-2.665-.3-5.466-1.332-5.466-5.93 0-1.312.465-2.387 1.22-.32.062-.324.23-.746.545-1.096.314-.351.481-.853.481-1.36 0-1.042-.843-1.884-1.886-1.884-.112 0-.224.012-.335.023-.974-.316-2.009-.434-2.66-.434-.336 0-.376-.02-.376-.328s.094-.328.376-.328c.651 0 1.686.118 2.66.434.111-.011.223-.023.335-.023 1.043 0 1.886.842 1.886 1.884 0 .507-.167.952-.481 1.36-.315.35-.483.77-.545 1.096-.755.932-1.22 1.996-1.22 3.298 0 4.629 2.801 5.629 5.457 5.92-.04.359-.074.67-.074 1.012v3.084c0 .316.194.697.799.576c4.766-1.587 8.2-6.085 8.2-11.387c0-6.627-5.373-12-12-12z"/></svg><a href="${github}" target="_blank">${github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, 'github.com/').replace(/\/$/, '')}</a></span>` : ''}
                ${location ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${location}</span>` : ''}
            </div>
        </div>

        <div class="main-content-grid">
            <div>
                ${summary ? `<div class="resume-section"><h3 class="resume-section-title">SUMMARY</h3><p class="summary-text">${summary}</p></div>` : ''}

                ${experienceEntries.length ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">EXPERIENCE</h3>
                    <ul>
                        ${experienceEntries.map(e => `
                            <li>
                                <span class="float-right">${e[3] || ''} - ${e[4] || ''}</span>
                                <strong>${e[0] || ''}</strong>, ${e[1] || ''}
                                ${e[2] ? `<span class="location-text"> | ${e[2]}</span>` : ''}
                                ${formatBulletPoints(e[5])} </li>
                        `).join('')}
                    </ul>
                </div>` : ''}

                ${educationEntries.length ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">EDUCATION</h3>
                    <ul>
                        ${educationEntries.map(e => `
                            <li>
                                ${e[5] ? `<span class="gpa-text">${e[5]}</span>` : ''}
                                <span class="float-right">${e[3] || ''} - ${e[4] || ''}</span>
                                <strong>${e[0] || ''}</strong>, ${e[1] || ''}
                                ${e[2] ? `<span class="location-text"> | ${e[2]}</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>` : ''}

                ${projectEntries.length ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">PROJECTS</h3>
                    <ul>
                        ${projectEntries.map(e => `
                            <li>
                                <strong>${e[0] || ''}</strong>
                                <span class="float-right">${e[1] || ''} - ${e[2] || ''}</span>
                                ${formatBulletPoints(e[3])} ${e[4] ? `<p><a href="${e[4]}" target="_blank" class="project-link">${e[4]}</a></p>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>` : ''}
            </div>

            <div>
                ${skills ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">TECHNICAL SKILLS</h3>
                    <div>${formatCategorizedSkills(skills)}</div>
                </div>` : ''}

                ${coursework ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">COURSE WORK</h3>
                    <div>${formatTags(coursework, 'course-tag')}</div>
                </div>` : ''}

                ${certificationEntries.length ? `
                <div class="resume-section">
                    <h3 class="resume-section-title">CERTIFICATIONS</h3>
                    <ul>
                        ${certificationEntries.map(e => `<li>${e[0]}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
        </div>
    `;

    preview.innerHTML = resumeHtml;
}

function exportPDF() {
    generateResume(); // Ensure the resume content is up-to-date

    const resumeElement = document.getElementById("resume-preview");

    // Use a short delay to ensure rendering is complete before PDF generation
    setTimeout(() => {
        html2pdf().set({
            margin: 0.4,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Increase scale for better quality
                useCORS: true,
                allowTaint: true,
                logging: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        }).from(resumeElement).save();
    }, 300); // A small delay
}




// --- Progress Bar Logic ---
function updateProgressBar() {
    const form = document.getElementById('resume-form');
    const inputs = form.querySelectorAll('input, textarea');
    let filledFields = 0;
    let totalFields = 0;

    inputs.forEach(input => {
        // Exclude the "Remove" buttons from being counted as input fields
        if (input.type === 'button' && input.textContent === 'Remove') {
            return;
        }

        totalFields++;
        if (input.value.trim() !== '') {
            filledFields++;
        }
    });

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (totalFields === 0) {
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
    } else {
        const percentage = (filledFields / totalFields) * 100;
        progressBar.style.width = `${percentage.toFixed(0)}%`;
        progressText.textContent = `${percentage.toFixed(0)}%`;
    }
}

function addInputListeners(container) {
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Only add event listener if it doesn't already have one
        if (!input.dataset.listenerAdded) {
            input.addEventListener('input', updateProgressBar);
            input.dataset.listenerAdded = 'true';
        }
    });
}


// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    generateResume();
    addInputListeners(document.getElementById('resume-form')); // Add listeners to initial inputs
    updateProgressBar(); // Calculate initial progress
});
