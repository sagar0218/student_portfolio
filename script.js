document.addEventListener('DOMContentLoaded', () => {
    
    // Default Static Profile Data (Sagar's Profile)
    const defaultProfile = {
        name: "Lakkawar Sagar",
        role: "Data Science Student & Aspiring Web Developer",
        about: "I am a passionate Computer Science and Engineering (Data Science) student focused on creating innovative and user-friendly web solutions. I love combining technical skills with creative layouts to build dynamic digital experiences.",
        github: "https://github.com/sagar0218",
        linkedin: "https://linkedin.com",
        skills: ["Python Programming", "SQL & Databases", "Data Visualization", "HTML & CSS"],
        resumeFile: "sagar_resume.pdf",
        resumeFileName: "sagar_resume.pdf",
        proj1Title: "Bank Management System",
        proj1Desc: "A console-based application that simulates fundamental banking operations like account creation, deposits, withdrawals, and balance inquiries. Built using structures, linked lists, and file handling for permanent storage.",
        proj1File: "Bank_management_system.pdf",
        proj1FileName: "Bank_management_system.pdf",
        proj2Title: "Student Grade Analyzer",
        proj2Desc: "An automation tool that processes student marks using the 'dplyr' package, automatically evaluates final letter grades based on percentages, and generates real-time performance bar charts via 'ggplot2'.",
        proj2File: "student_grade_analyzer.pdf",
        proj2FileName: "student_grade_analyzer.pdf"
    };

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    const profileSelect = document.getElementById('profile-select');
    
    function getStoredProfiles() {
        const stored = localStorage.getItem('studentProfiles');
        return stored ? JSON.parse(stored) : {};
    }

    function renderDropdown() {
        profileSelect.innerHTML = '<option value="default">Lakkawar Sagar (Default)</option>';
        const profiles = getStoredProfiles();
        Object.keys(profiles).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            profileSelect.appendChild(option);
        });
    }

    // NEW FEATURE: Pulls existing data BACK into the inputs for easy editing!
    function populateEditorInputs(profile, isDefault = false) {
        document.getElementById('input-name').value = isDefault ? "" : profile.name;
        document.getElementById('input-role').value = profile.role || "";
        document.getElementById('input-about').value = profile.about || "";
        document.getElementById('input-github').value = profile.github === "#" ? "" : (profile.github || "");
        document.getElementById('input-linkedin').value = profile.linkedin === "#" ? "" : (profile.linkedin || "");
        
        // Join skills array back into a comma-separated string for editing
        if (Array.isArray(profile.skills)) {
            document.getElementById('input-skills').value = profile.skills.join(', ');
        } else {
            document.getElementById('input-skills').value = profile.skills || "";
        }

        document.getElementById('input-proj1-title').value = profile.proj1Title || "";
        document.getElementById('input-proj1-desc').value = profile.proj1Desc || "";
        document.getElementById('input-proj2-title').value = profile.proj2Title || "";
        document.getElementById('input-proj2-desc').value = profile.proj2Desc || "";
        
        // Clear file inputs for security/privacy reasons
        document.getElementById('input-resume-file').value = "";
        document.getElementById('input-proj1-file').value = "";
        document.getElementById('input-proj2-file').value = "";
    }

    function applyProfileLayout(profile) {
        document.getElementById('portfolio-name').textContent = profile.name;
        document.getElementById('portfolio-role').textContent = profile.role;
        document.getElementById('portfolio-about').textContent = profile.about;
        
        document.getElementById('github-link').setAttribute('href', profile.github || "https://github.com/sagar0218");
        document.getElementById('linkedin-link').setAttribute('href', profile.linkedin || "https://linkedin.com");

        const iconMap = {
            'python': 'fab fa-python',
            'sql': 'fas fa-database',
            'database': 'fas fa-database',
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'java': 'fab fa-java',
            'c++': 'fas fa-code',
            'linux': 'fab fa-linux',
            'javascript': 'fab fa-js',
            'react': 'fab fa-react',
            'git': 'fab fa-git-alt',
            'data visualization': 'fas fa-chart-bar',
            'chart': 'fas fa-chart-pie'
        };

        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = ''; 
        
        const skillsList = Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim()).filter(s => s !== "");
        
        skillsList.forEach(skill => {
            const lowerSkill = skill.toLowerCase();
            let matchedIcon = 'fas fa-code';

            for (const key in iconMap) {
                if (lowerSkill.includes(key)) {
                    matchedIcon = iconMap[key];
                    break;
                }
            }

            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `<i class="${matchedIcon}"></i> <h3>${skill}</h3>`;
            skillsContainer.appendChild(card);
        });

        document.getElementById('resume-link').setAttribute('href', profile.resumeFile);
        document.getElementById('resume-link').setAttribute('download', profile.resumeFileName || "resume.pdf");

        document.getElementById('proj1-title').textContent = profile.proj1Title;
        document.getElementById('proj1-desc').textContent = profile.proj1Desc;
        document.getElementById('proj1-link').setAttribute('href', profile.proj1File);
        document.getElementById('proj1-link').setAttribute('download', profile.proj1FileName || "project1.pdf");

        document.getElementById('proj2-title').textContent = profile.proj2Title;
        document.getElementById('proj2-desc').textContent = profile.proj2Desc;
        document.getElementById('proj2-link').setAttribute('href', profile.proj2File);
        document.getElementById('proj2-link').setAttribute('download', profile.proj2FileName || "project2.pdf");
    }

    function readFileAsBase64(file) {
        return new Promise((resolve) => {
            if (!file) resolve(null);
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // Save/Update profile handler
    document.getElementById('save-profile-btn').addEventListener('click', async () => {
        const name = document.getElementById('input-name').value.trim();
        const role = document.getElementById('input-role').value.trim();
        const about = document.getElementById('input-about').value.trim();
        const github = document.getElementById('input-github').value.trim();
        const linkedin = document.getElementById('input-linkedin').value.trim();
        const skills = document.getElementById('input-skills').value.trim();
        
        const resumeFileEl = document.getElementById('input-resume-file').files[0];
        const proj1Title = document.getElementById('input-proj1-title').value.trim();
        const proj1Desc = document.getElementById('input-proj1-desc').value.trim();
        const proj1FileEl = document.getElementById('input-proj1-file').files[0];

        const proj2Title = document.getElementById('input-proj2-title').value.trim();
        const proj2Desc = document.getElementById('input-proj2-desc').value.trim();
        const proj2FileEl = document.getElementById('input-proj2-file').files[0];

        if (!name || !role) {
            alert("Please provide at least a Student Name and Domain Role to save.");
            return;
        }

        const profiles = getStoredProfiles();
        const existingProfile = profiles[name] || {};

        const resumeData = await readFileAsBase64(resumeFileEl);
        const file1Data = await readFileAsBase64(proj1FileEl);
        const file2Data = await readFileAsBase64(proj2FileEl);

        profiles[name] = {
            name: name,
            role: role,
            about: about || "No summary provided.",
            github: github || "#",
            linkedin: linkedin || "#",
            skills: skills || "General Engineering",
            // If they didn't upload a new file, retain the old file data
            resumeFile: resumeData || existingProfile.resumeFile || "#",
            resumeFileName: resumeFileEl ? resumeFileEl.name : (existingProfile.resumeFileName || "resume.pdf"),
            proj1Title: proj1Title || "Custom Student Project 1",
            proj1Desc: proj1Desc || "Description of technical implementation details.",
            proj1File: file1Data || existingProfile.proj1File || "#",
            proj1FileName: proj1FileEl ? proj1FileEl.name : (existingProfile.proj1FileName || "project1.pdf"),
            proj2Title: proj2Title || "Custom Student Project 2",
            proj2Desc: proj2Desc || "Description of technical implementation details.",
            proj2File: file2Data || existingProfile.proj2File || "#",
            proj2FileName: proj2FileEl ? proj2FileEl.name : (existingProfile.proj2FileName || "project2.pdf")
        };

        try {
            localStorage.setItem('studentProfiles', JSON.stringify(profiles));
            renderDropdown();
            profileSelect.value = name;
            applyProfileLayout(profiles[name]);
            alert(`Profile for ${name} updated successfully!`);
        } catch (e) {
            alert("Storage limit reached! Please try uploading smaller sized PDF assets.");
        }
    });

    // Delete handler
    document.getElementById('delete-profile-btn').addEventListener('click', () => {
        const currentSelectedValue = profileSelect.value;
        if (currentSelectedValue === 'default') {
            alert("The default profile (Lakkawar Sagar) is part of the template and cannot be removed!");
            return;
        }
        if (confirm(`Delete profile "${currentSelectedValue}"?`)) {
            const profiles = getStoredProfiles();
            delete profiles[currentSelectedValue];
            localStorage.setItem('studentProfiles', JSON.stringify(profiles));
            renderDropdown();
            profileSelect.value = 'default';
            applyProfileLayout(defaultProfile);
            populateEditorInputs(defaultProfile, true);
            alert("Profile deleted.");
        }
    });

    // Dropdown switcher listener (Populates fields dynamically now!)
    // Dropdown switcher listener (Handles both editing AND creating fresh profiles!)
    profileSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'default') {
            applyProfileLayout(defaultProfile);
            
            // Wipes the control panel completely clean so you can type a fresh student instantly!
            document.getElementById('input-name').value = "";
            document.getElementById('input-role').value = "";
            document.getElementById('input-about').value = "";
            document.getElementById('input-github').value = "";
            document.getElementById('input-linkedin').value = "";
            document.getElementById('input-skills').value = "";
            document.getElementById('input-proj1-title').value = "";
            document.getElementById('input-proj1-desc').value = "";
            document.getElementById('input-proj2-title').value = "";
            document.getElementById('input-proj2-desc').value = "";
            
            // Clear file fields
            document.getElementById('input-resume-file').value = "";
            document.getElementById('input-proj1-file').value = "";
            document.getElementById('input-proj2-file').value = "";
        } else {
            const profiles = getStoredProfiles();
            if (profiles[val]) {
                applyProfileLayout(profiles[val]);
                populateEditorInputs(profiles[val], false); // Autofill values for editing existing students
            }
        }
    });

    // Reset database data
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if(confirm("Delete all saved student custom profiles?")) {
            localStorage.removeItem('studentProfiles');
            renderDropdown();
            applyProfileLayout(defaultProfile);
            populateEditorInputs(defaultProfile, true);
        }
    });

    // --- LIVE WEB3FORMS EMAIL ROUTER DISPATCHER ---
    const contactForm = document.getElementById('portfolio-form');
    const formFeedback = document.getElementById('form-feedback');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentSelectedValue = profileSelect.value;
        let activeProfileName = defaultProfile.name;
        
        if (currentSelectedValue !== 'default') {
            const profiles = getStoredProfiles();
            if (profiles[currentSelectedValue]) {
                activeProfileName = profiles[currentSelectedValue].name;
            }
        }

        formFeedback.style.color = '#f1c40f';
        formFeedback.textContent = "Sending message securely...";

        const formData = new FormData();
        formData.append("access_key", "7d12cf0c-ffb8-4bac-b56e-4c9630954502");
        formData.append("name", document.getElementById('name').value.trim());
        formData.append("email", document.getElementById('email').value.trim());
        formData.append("message", `New Contact Form Submission for Profile: ${activeProfileName}\n\n` + document.getElementById('message').value.trim());

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                formFeedback.style.color = '#2ecc71';
                formFeedback.textContent = `Success! Message sent to ${activeProfileName}'s tracking board.`;
                contactForm.reset();
            } else {
                formFeedback.style.color = '#e74c3c';
                formFeedback.textContent = "Submission rejected by server. Verify key status.";
            }
        } catch (error) {
            formFeedback.style.color = '#e74c3c';
            formFeedback.textContent = "Network error connection failed.";
        }
    });

    // Initial setup loading template configuration instantly
    renderDropdown();
    applyProfileLayout(defaultProfile);
    populateEditorInputs(defaultProfile, true);
});
