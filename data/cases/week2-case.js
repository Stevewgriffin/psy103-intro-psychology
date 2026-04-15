export default {
  caseNumber: 'CI-PSY-2026-002',
  title: 'Forty Hours Without Sleep — Performance, Perception, and the Limits of Endurance',
  author: 'Professor Steve Griffin',
  institution: 'Williamson College',
  date: 'Summer 2026',
  sections: [
    {
      heading: 'Background',
      content: '<p>In July 2024, Dr. Mara Chen, a second-year medical resident at a teaching hospital in Atlanta, completed a 28-hour on-call shift in the emergency department. During the final four hours of her shift, she misread a CT scan, overlooking a small but significant subdural hematoma in a 72-year-old patient who had fallen at home. The error was caught eight hours later by the incoming attending physician. The patient survived but required emergency surgery that might have been avoided with earlier detection. A subsequent hospital review raised difficult questions about the role of sleep deprivation in medical errors and the policies that allow extended shifts for trainees.</p>',
    },
    {
      heading: 'The Science of Sleep Deprivation',
      content: '<p>Research on sleep deprivation has consistently demonstrated that going without sleep for 24 hours produces cognitive impairments comparable to a blood alcohol concentration of 0.10 percent, which exceeds the legal limit for driving in every U.S. state. Studies using functional MRI have shown that sleep deprivation reduces activity in the prefrontal cortex, the brain region most associated with executive functions such as decision-making, attention, and error monitoring. At the same time, the amygdala becomes hyperactive, amplifying emotional reactivity and impairing the capacity for calm, reasoned judgment.</p><p>Sleep-deprived individuals also experience "microsleeps," brief episodes lasting one to thirty seconds during which the brain enters a sleep-like state despite the person appearing awake. During microsleeps, sensory processing is markedly diminished, and reaction times slow dramatically. Research by the AAA Foundation for Traffic Safety has estimated that drowsy driving is a factor in approximately 328,000 motor vehicle crashes annually in the United States.</p>',
    },
    {
      heading: 'The Medical Training Culture',
      content: '<p>The Accreditation Council for Graduate Medical Education (ACGME) has repeatedly revised its work-hour restrictions for medical residents. In 2003, weekly hours were capped at 80. In 2011, first-year residents were limited to 16-hour shifts. However, in 2017, the ACGME reversed course and allowed first-year residents to work up to 24 consecutive hours again, citing research that the 2011 restrictions had not clearly improved patient outcomes and had created difficulties with handoff communication between shift changes.</p><p>Critics of extended shifts argue that the ACGME\'s decision prioritized institutional convenience and tradition over the well-documented science of sleep and cognition. Supporters counter that continuity of care matters and that frequent handoffs introduce their own category of errors. The debate remains unresolved and deeply consequential for the roughly 140,000 medical residents currently training in the United States.</p>',
    },
    {
      heading: 'Dr. Chen\'s Perspective',
      content: '<p>In her written statement during the hospital review, Dr. Chen described feeling alert and capable during the first 20 hours of her shift. Around hour 22, she noticed difficulty concentrating but attributed it to normal fatigue that she believed she could push through. She did not recall feeling impaired when she reviewed the CT scan at hour 25. She was, in her own words, "confident in the reading at the time." Research on sleep deprivation suggests that one of its most dangerous effects is this very phenomenon: the impaired individual loses the ability to accurately assess their own level of impairment, a finding that parallels research on alcohol intoxication.</p>',
    },
  ],
  exhibits: [
    {
      title: 'Exhibit 1: Cognitive Performance Decline by Hours of Wakefulness',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Hours Awake</th><th>Reaction Time (% slower than baseline)</th><th>Error Rate on Attention Tasks</th><th>Equivalent BAC</th></tr></thead><tbody><tr><td>16 hours</td><td>Baseline</td><td>Baseline</td><td>0.00%</td></tr><tr><td>18 hours</td><td>+15%</td><td>+20%</td><td>0.05%</td></tr><tr><td>20 hours</td><td>+25%</td><td>+35%</td><td>0.08%</td></tr><tr><td>24 hours</td><td>+45%</td><td>+60%</td><td>0.10%</td></tr><tr><td>28 hours</td><td>+70%</td><td>+95%</td><td>0.12%</td></tr></tbody></table><p><em>Source: Adapted from Dawson &amp; Reid (1997) and Williamson &amp; Feyer (2000). Figures are approximate composites from multiple studies.</em></p>',
    },
    {
      title: 'Exhibit 2: ACGME Resident Work-Hour Regulations Timeline',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Year</th><th>Policy Change</th></tr></thead><tbody><tr><td>Pre-2003</td><td>No national limits; 100+ hour weeks common</td></tr><tr><td>2003</td><td>80-hour weekly cap; 24-hour shift limit with 6-hour extension for handoff</td></tr><tr><td>2011</td><td>First-year residents limited to 16-hour shifts; upper-level residents capped at 24 hours</td></tr><tr><td>2017</td><td>16-hour limit for first-years removed; all residents permitted up to 24-hour shifts</td></tr></tbody></table>',
    },
  ],
  questions: [
    {
      id: 1,
      prompt: 'Using the data in Exhibit 1 and the concepts from Chapter 4 on states of consciousness, explain the physiological and cognitive mechanisms through which sleep deprivation impaired Dr. Chen\'s performance. Be specific about which brain structures and cognitive functions were likely affected.',
      wordMin: 150,
    },
    {
      id: 2,
      prompt: 'Dr. Chen reported feeling "confident in the reading at the time" despite being severely sleep-deprived. Drawing on research about metacognition and self-assessment under impaired conditions, explain why this self-assessment is unreliable. How does this parallel findings in other areas of impaired judgment, such as alcohol intoxication?',
      wordMin: 100,
    },
    {
      id: 3,
      prompt: 'The ACGME faces a genuine dilemma: limiting shift hours may reduce fatigue-related errors but may increase handoff-related errors. Drawing on what you have learned about sensation, perception, and attention (Chapter 5), analyze both sides of this tradeoff. Which risk do you believe is greater, and why?',
      wordMin: 150,
    },
    {
      id: 4,
      prompt: 'Apply principles from Chapter 6 on learning to propose a training program that could help medical residents better recognize the signs of dangerous fatigue in themselves. What conditioning or observational learning techniques might be effective? What are the limitations of such an approach given what you know about impaired self-monitoring?',
      wordMin: 150,
    },
  ],
};
