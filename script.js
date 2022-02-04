const ENDPOINT = 'https://api.github.com/graphql';
const TOKEN = 'replace with token';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

const body = {
  query: `
query { 
    viewer{
     bio,
     avatarUrl,
     login,
     name,
     topRepositories(
       first:20
       orderBy:{
       field:UPDATED_AT,
         direction:DESC
     }
   ) {
     totalCount,
       nodes{
         updatedAt,
         description,
         url,
         stargazerCount,
         name,
         forkCount,
         primaryLanguage{
           color,
           name
         }
       }
         }
       }
   }
`,
};

const fetchData = async () => {
  let result;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });

    const data = await res.json();

    result = data.data.viewer;
  } catch (error) {
    console.error(error);
  } finally {
    return result;
  }
};

//
(async () => {
  const data = await fetchData();
  if (data == undefined) return;

  const relativeTime = (time) => {
    const getFormattedDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lagos',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));
    };
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = new Date() - new Date(time);

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return 'on ' + getFormattedDate(time);
    } else {
      return Math.round(elapsed / msPerYear);
    }
  };

  const { avatarUrl, login, name, bio, topRepositories } = data;
  const { totalCount, nodes } = topRepositories;

  const bigAvatar = document.querySelector('#big-avatar');
  bigAvatar.src = avatarUrl;
  document.querySelector('#small-avatar').src = avatarUrl;
  document.querySelector('#small-avatar2').src = avatarUrl;
  document.querySelector('#small-avatar3').src = avatarUrl;
  document.querySelector('#name').textContent = name;
  document.querySelector('#login').textContent = login;
  document.querySelector('#login2').textContent = login;
  document.querySelector('#bio').textContent = bio;
  document.querySelector('#pill').textContent = totalCount;
  document.querySelector('#count').textContent = totalCount;

  const repoList = document.querySelector('#repo-list');
  const repoTemplate = ({
    description,
    forkCount,
    name,
    primaryLanguage,
    stargazerCount,
    updatedAt,
    url,
  }) => {
    return `
    <li
                class="repo py-24 flex"
                style="border-bottom: 1px solid #e1e4e8"
              >
                <div style="flex: 3">
                  <h3 class="mb-4 text-md font-bolder line-30">
                    <a href="${url}">${name}</a>
                  </h3>
                  <p class="line-21">
                    ${description ?? ''}
                  </p>
                  <div class="details flex line-18">
                    <span class="mr-16 flex items-center">
                      <span
                        style="
                          background-color: ${primaryLanguage?.color};
                          height: 10px;
                          width: 10px;
                          margin-right: 3px;
                        "
                        class="border-round inline-block"
                      ></span>
                      <span>${primaryLanguage?.name}</span>
                    </span>
                    <a href="" class="link mr-16 flex items-center">
                      <svg
                        aria-label="star"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        height="16"
                        role="img"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                        ></path>
                      </svg>
                      <span class="ml-3">${stargazerCount}</span>
                    </a>
                    <a href="" class="link mr-16 flex items-center">
                      <svg
                        aria-label="fork"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        height="16"
                        role="img"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        ></path>
                      </svg>
                      <span class="ml-3">${forkCount}</span>
                    </a>
                    <span>Updated ${relativeTime(updatedAt)}</span>
                  </div>
                </div>
                <div class="flex justify-end items-start" style="flex: 1">
                  <button style="padding: 3px 12px" class="btn flex items-center text-sm line-20" style="">
                    <svg
                      viewBox="0 0 16 16"
                      version="1.1"
                      width="16"
                      height="16"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                      ></path>
                    </svg>
                    <span class="ml-4"> star</span>
                  </button>
                </div>
              </li>
    `;
  };
  nodes.forEach((e) => {
    if (!e) return;
    const li = document.createElement('li');
    li.innerHTML = repoTemplate(e).trim();
    repoList.appendChild(li);
  });

  //Toggle harmburger
  document.querySelector('#harmburger').addEventListener('click', (e) => {
    const style = document.querySelector('.middle-nav').style;
    if (style.display !== 'flex') {
      style.display = 'flex';
    } else {
      style.display = '';
    }
  });

  document.addEventListener(
    'scroll',
    () => {
      const rect = bigAvatar.getBoundingClientRect();
      isOffScreen = rect.bottom < 0;
      const tinyProfile = document.querySelector('.tiny-profile');
      if (isOffScreen) {
        tinyProfile.style.display = 'flex';
      } else {
        tinyProfile.style.display = '';
      }
    },
    {
      passive: true,
    }
  );

  name.textContent = document.body.classList.remove('hidden');
})();
