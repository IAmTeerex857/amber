\- In auth, there is orgs, presidents, and ambassadors.

\- ⁠Presidents are responsible for chapters; chapters can be countries or regions

\- ⁠If logged in/sign up as a president you have to be added to an organisation. 

\- ⁠Presidents receive $10k monthly to distribute to ambassadors as rewards. There are some tasks that ambassadors would need to receive money from presidents to carry out.

Here is the updated operations. We are building this product for stellar, they our the pilot organization we are building for. After speaking with some reps at stellar, here is what we got:

How things work now without amber:   
\- Users get onboarded via airtable and after form submission, they get an email that contains a welcome message, next steps, and rules and regulations.   
\- After accepting the rules and regulations, they get added to discord. 

Now on amber, it should be when organizations(stellar) are setting up their org, they need to add their discord links, they also add regions and countries they operate in. Then we know that presidents and ambassadors when they onboard themselves, they have to select what organization they are joining and this sends a request to the org that needs to be accepted. Then after acceptance, they can select the region they belong to, join the discord etc

How things work:  
After being added to discord, ambassadors are assigned roles.

On amber; after account creation, being accepted to an org, joined discord, users will be asked to select their strengths(roles). It ranges from content creators, community managers, partnerships etc.

How things work:  
Ambassadors are to submit reports(monthly) of their tasks completed. Reports contains pictures, videos, links, if task is to create event, it will contain attendee list, receipts of purchases for the events. They submit this in a google drive 

On amber, it will work this way; ambassadors submit reports on their tasks completed. They submit the report on amber and automatically, the reports submitted will be updated on airtable with the use of n8n(Reports are submitted in google drive). Note that ambassadors will also still submit proof of task completions per task normally. Reports come at the end of the month. Report links will exist on amber and still be imputed in the airtable automatically. Reports can also be exported from amber

For presidents, a particular frustration is that these reports submitted by ambassadors, the presidents have to analyze them individually and submit a cumulative report. This is too manual so we will also be using n8n for this too. The ai agent will analyze all reports submissions from ambassadors and create a cumulative report. The presidents also further has to input ambassadors report submissions into an airtable from the google drive but we already addressed that n8n will be used to automate this.   
Then, the president will get to see the cumulative report on his dashboard and also sent to his email which is now sent to the stellar global office. 

Now for rewards: rewards are not necessarily by task completions thay are done by; tracking engagements on discord, amount of tasks completed, attendance in community calls etc.  
There are also incentives for top ambassadors based on scope and work.   
Ambassadors that are into concrete content creation can get micro-grants to purchase equipments that will help in their content creation. 

Note that the automations for submissions, reports will be done by ai agents(n8n).

Payments and rewards:  
\- Rewards are points which are payments(XLM). Points are gotten from submissions and engagements etc.   
Further notes from the stellar reps:  
