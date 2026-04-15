export default {
  caseNumber: 'CI-PSY-2026-004',
  title: 'The Culture of Silence — Conformity, Obedience, and Organizational Failure',
  author: 'Professor Steve Griffin',
  institution: 'Williamson College',
  date: 'Summer 2026',
  sections: [
    {
      heading: 'Background',
      content: '<p>Meridian Health Systems was a mid-sized hospital network operating four facilities across the southeastern United States. In 2023, an internal audit revealed a pattern of underreporting adverse patient events, including medication errors, falls, and post-surgical infections. The audit found that over an 18-month period, frontline nurses and medical technicians had documented fewer than 40 percent of qualifying incidents in the hospital\'s official reporting system. The gap between actual events and reported events was not random; it followed a consistent pattern that pointed to organizational culture rather than individual negligence.</p>',
    },
    {
      heading: 'The Situation',
      content: '<p>Interviews conducted during the investigation revealed a pervasive culture of silence. Junior staff members described feeling pressure not to file incident reports because doing so was perceived as creating problems for their unit. One nurse reported that after filing a report about a medication dosage error, her supervisor called her into the office and said, "We handle things internally. Writing it up makes the whole team look bad." Another technician described watching colleagues make errors and choosing not to speak up because "everyone else seemed fine with it, so I figured I was the one overreacting."</p><p>The pattern was reinforced by subtle social mechanisms. Units with low incident report numbers were praised in staff meetings. Managers whose units had high reporting rates faced uncomfortable questions from regional leadership. Over time, not reporting became the norm, and staff members who did report felt isolated and sometimes faced informal social consequences such as being excluded from preferred shift assignments or being passed over for mentorship opportunities.</p>',
    },
    {
      heading: 'The Social Psychology at Work',
      content: '<p>The Meridian case illustrates several well-documented social psychological phenomena operating simultaneously. Conformity pressures, similar to those demonstrated in Asch\'s line experiments, led individual staff members to suppress their own judgments when the group norm favored silence. Obedience to authority, as studied by Milgram, operated through the hierarchical structure of medical teams, where challenging a supervisor\'s implicit expectations carried professional risk. Diffusion of responsibility meant that when multiple people witnessed an error, each assumed someone else would report it or that reporting was not their specific obligation.</p><p>Groupthink dynamics further entrenched the problem. Teams developed a shared belief that their unit\'s performance was strong and that incident reports were unnecessary bureaucratic burdens. Dissenting voices were viewed not as safety advocates but as disloyal team members. The result was an organization in which the very system designed to catch and correct errors had been quietly disabled by social forces that no single individual had consciously chosen to create.</p>',
    },
    {
      heading: 'The Aftermath',
      content: '<p>After the audit findings were made public internally, Meridian Health Systems hired an organizational psychologist to redesign their safety culture. The consultant implemented anonymous reporting channels, restructured incentives to reward reporting rather than punish it, and introduced bystander intervention training adapted from social psychology research. Leadership underwent training on the psychological dynamics of authority and conformity. Perhaps most importantly, the organization acknowledged publicly to all staff that the problem was systemic, not individual, which research suggests is a critical step in shifting organizational norms.</p>',
    },
  ],
  exhibits: [
    {
      title: 'Exhibit 1: Incident Reporting Gap at Meridian Health Systems (2022-2023)',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Incident Category</th><th>Estimated Actual Events</th><th>Officially Reported</th><th>Reporting Rate</th></tr></thead><tbody><tr><td>Medication Errors</td><td>412</td><td>147</td><td>36%</td></tr><tr><td>Patient Falls</td><td>189</td><td>102</td><td>54%</td></tr><tr><td>Post-Surgical Infections</td><td>67</td><td>31</td><td>46%</td></tr><tr><td>Equipment Malfunctions</td><td>94</td><td>28</td><td>30%</td></tr><tr><td><strong>Total</strong></td><td><strong>762</strong></td><td><strong>308</strong></td><td><strong>40%</strong></td></tr></tbody></table>',
    },
    {
      title: 'Exhibit 2: Staff Survey Results on Reporting Barriers (n = 214)',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Barrier to Reporting</th><th>Percentage Who Agreed or Strongly Agreed</th></tr></thead><tbody><tr><td>"Reporting makes my unit look bad"</td><td>68%</td></tr><tr><td>"My supervisor discourages filing reports"</td><td>41%</td></tr><tr><td>"I assumed someone else would report it"</td><td>57%</td></tr><tr><td>"I was unsure if the event qualified as reportable"</td><td>49%</td></tr><tr><td>"I feared negative consequences for my career"</td><td>52%</td></tr><tr><td>"Colleagues who report are seen as troublemakers"</td><td>44%</td></tr></tbody></table>',
    },
  ],
  questions: [
    {
      id: 1,
      prompt: 'Using specific concepts from Chapter 12 on social psychology, identify and explain at least three distinct social psychological phenomena that contributed to the underreporting culture at Meridian Health Systems. For each phenomenon, cite the relevant research (e.g., Asch, Milgram, Latane and Darley) and explain how it manifested in this specific organizational context.',
      wordMin: 150,
    },
    {
      id: 2,
      prompt: 'Examine the staff survey results in Exhibit 2. How do the percentages reflect the interaction between conformity pressures, obedience to authority, and diffusion of responsibility? Which barrier do you think is most dangerous for patient safety, and why?',
      wordMin: 100,
    },
    {
      id: 3,
      prompt: 'Drawing on Chapter 11\'s discussion of personality theories, consider why some individuals might resist conformity pressure and report incidents despite the social cost. What personality traits, according to the Big Five model or other frameworks, might predict whistleblowing behavior? What are the limitations of explaining organizational problems through individual personality?',
      wordMin: 150,
    },
    {
      id: 4,
      prompt: 'The organizational psychologist recommended systemic changes rather than punishing individuals. Drawing on concepts from both social psychology and motivation theory (Chapter 10), design your own three-part intervention plan for transforming the safety culture at an organization like Meridian. Explain the psychological principles underlying each element of your plan.',
      wordMin: 150,
    },
  ],
};
