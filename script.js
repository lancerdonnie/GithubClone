const ENDPOINT = 'https://api.github.com/graphql';
const TOKEN = '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';

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

const init = async () => {
  let result;

  try {
    const result = await fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const data = await result.json();

    result = data.data.viewer;
  } catch (error) {
    console.error(error);
  }
};

init();