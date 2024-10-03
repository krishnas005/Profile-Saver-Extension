document.getElementById('saveProfile').addEventListener('click', saveProfile);
document.getElementById('viewSavedProfiles').addEventListener('click', showSavedProfiles);
document.getElementById('goBack').addEventListener('click', goBack);

function saveProfile() {
  const profileName = document.getElementById('profileName').value;
  const profileURL = document.getElementById('profileURL').value;

  if (!profileName || !profileURL) {
    showNotification('Please enter both profile name and URL.');
    return;
  }

  chrome.storage.sync.get({ profiles: [] }, (result) => {
    const profiles = result.profiles;
    profiles.push({ name: profileName, url: profileURL });
    chrome.storage.sync.set({ profiles }, () => {
      showNotification('Profile saved successfully!');
      document.getElementById('profileName').value = '';
      document.getElementById('profileURL').value = '';
    });
  });
}

function showSavedProfiles() {
  chrome.storage.sync.get({ profiles: [] }, (result) => {
    const profiles = result.profiles;
    const profilesDiv = document.getElementById('profiles');
    profilesDiv.innerHTML = '';

    if (profiles.length === 0) {
      profilesDiv.innerHTML = '<p>No profiles saved yet.</p>';
    } else {
      profiles.forEach((profile, index) => {
        const profileDiv = document.createElement('div');
        profileDiv.className = 'profile-item';
        profileDiv.innerHTML = `
          <span>${profile.name}</span>
          <div>
            <button class="copy" data-url="${profile.url}"><i class="fas fa-copy"></i></button>
            <button class="delete" data-index="${index}"><i class="fas fa-trash"></i></button>
          </div>
        `;
        profilesDiv.appendChild(profileDiv);
      });

      document.querySelectorAll('.copy').forEach((button) => {
        button.addEventListener('click', (e) => {
          const url = e.target.closest('button').getAttribute('data-url');
          copyToClipboard(url);
          showNotification('Profile URL copied!');
        });
      });

      document.querySelectorAll('.delete').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = e.target.closest('button').getAttribute('data-index');
          deleteProfile(index);
        });
      });
    }
  });

  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('saved-screen').style.display = 'block';
}

function goBack() {
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('saved-screen').style.display = 'none';
}

function deleteProfile(index) {
  chrome.storage.sync.get({ profiles: [] }, (result) => {
    const profiles = result.profiles;
    profiles.splice(index, 1);
    chrome.storage.sync.set({ profiles }, () => {
      showNotification('Profile deleted.');
      showSavedProfiles();
    });
  });
}

function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = text;
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

function showNotification(message) {
  const notificationDiv = document.getElementById('notifications');
  notificationDiv.textContent = message;
  notificationDiv.style.display = 'block';
  setTimeout(() => {
    notificationDiv.style.display = 'none';
  }, 3000);
}
