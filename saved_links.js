document.addEventListener('DOMContentLoaded', () => {
    const profileList = document.getElementById('profileList');
    const backBtn = document.getElementById('backBtn');
  
    // Load and display saved profiles
    chrome.storage.sync.get(['profiles'], (result) => {
      const profiles = result.profiles || [];
      profiles.forEach((profile, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${profile.name}:</span>
          <a href="${profile.url}" target="_blank">${profile.url}</a>
          <button class="copy-btn" data-url="${profile.url}">Copy</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        profileList.appendChild(li);
      });
  
      // Copy profile URL to clipboard
      document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const url = e.target.getAttribute('data-url');
          navigator.clipboard.writeText(url).then(() => {
            alert('Copied to clipboard.');
          });
        });
      });
  
      // Delete profile
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          profiles.splice(index, 1);
          chrome.storage.sync.set({ profiles }, () => {
            alert('Profile deleted.');
            window.location.reload();
          });
        });
      });
    });
  
    // Navigate back to the main page
    backBtn.addEventListener('click', () => {
      window.location.href = 'popup.html';
    });
  });
  