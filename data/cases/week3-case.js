export default {
  caseNumber: 'CI-PSY-2026-003',
  title: 'The Wrong Man — Memory, Eyewitness Testimony, and the Cost of Certainty',
  author: 'Professor Steve Griffin',
  institution: 'Williamson College',
  date: 'Summer 2026',
  sections: [
    {
      heading: 'Background',
      content: '<p>On the night of March 14, 2003, a woman named Jennifer was assaulted in her apartment in Burlington, North Carolina. During the attack, she made a deliberate effort to study her assailant\'s face, determined that if she survived, she would be able to identify him. When police showed her a photo lineup several days later, she selected Ronald Cotton\'s photograph, saying she was "pretty sure" it was him. By the time the case went to trial, her certainty had solidified. On the witness stand, she pointed directly at Cotton and declared with absolute confidence that he was the man who attacked her. Ronald Cotton was convicted and sentenced to life in prison plus 54 years.</p>',
    },
    {
      heading: 'The Unraveling',
      content: '<p>Ronald Cotton spent more than ten years in prison before DNA evidence conclusively proved that another man, Bobby Poole, had committed the crime. Poole had even confessed to fellow inmates, and Cotton had encountered Poole in prison and urged authorities to investigate him. Despite this, Jennifer had been presented with Poole in a live lineup during the appeals process and stated with certainty that she had never seen him before. Her memory had reconstructed itself around Cotton\'s face so thoroughly that the actual perpetrator was unrecognizable to her.</p><p>After Cotton\'s exoneration in 1995, he and Jennifer eventually met, and she expressed profound remorse. They went on to co-author a book about the experience and became advocates for eyewitness identification reform. Their case became one of the most cited examples in the scientific literature on memory distortion and the dangers of eyewitness testimony.</p>',
    },
    {
      heading: 'The Science of Eyewitness Memory',
      content: '<p>Research by Elizabeth Loftus and others has demonstrated that human memory is not a recording device. It is a reconstructive process vulnerable to suggestion, contamination, and distortion. The misinformation effect shows that exposure to misleading post-event information can alter a witness\'s memory of the original event. Source monitoring errors occur when people remember information accurately but misattribute its origin. Confidence malleability research has shown that a witness\'s certainty can increase over time through processes unrelated to the accuracy of the original memory, such as confirming feedback from investigators.</p><p>Cross-race identification bias further complicates eyewitness reliability. Decades of research have demonstrated that people are significantly worse at identifying individuals of a different race than their own, a finding with profound implications for the criminal justice system. In Jennifer\'s case, the cross-race identification issue was not a factor, but the other mechanisms of memory distortion were powerfully at work.</p>',
    },
    {
      heading: 'Systemic Implications',
      content: '<p>The Innocence Project has documented over 375 wrongful convictions overturned by DNA evidence in the United States. In approximately 69 percent of these cases, eyewitness misidentification was a contributing factor, making it the single leading cause of wrongful convictions. Despite the scientific evidence, many jurors continue to place extraordinary weight on eyewitness testimony, particularly when the witness expresses high confidence. Research by Gary Wells has shown that jurors treat witness confidence as a reliable indicator of accuracy, even though the correlation between confidence and accuracy is weak, especially under suboptimal viewing conditions.</p>',
    },
  ],
  exhibits: [
    {
      title: 'Exhibit 1: Factors Contributing to Wrongful Convictions (Innocence Project Data)',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Contributing Factor</th><th>Percentage of DNA Exoneration Cases</th></tr></thead><tbody><tr><td>Eyewitness Misidentification</td><td>69%</td></tr><tr><td>Invalidated or Improper Forensic Science</td><td>44%</td></tr><tr><td>False Confessions / Incriminating Statements</td><td>29%</td></tr><tr><td>Informants / Snitches</td><td>17%</td></tr></tbody></table><p><em>Note: Percentages total more than 100% because multiple factors often contribute to a single wrongful conviction.</em></p>',
    },
    {
      title: 'Exhibit 2: Evidence-Based Lineup Reform Recommendations',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Reform</th><th>Rationale</th></tr></thead><tbody><tr><td>Double-blind administration</td><td>The officer administering the lineup does not know which person is the suspect, preventing unconscious cues</td></tr><tr><td>Sequential presentation</td><td>Showing photos one at a time rather than simultaneously reduces relative judgment (picking the person who looks most like the perpetrator)</td></tr><tr><td>Confidence statement at time of identification</td><td>Recording witness confidence immediately prevents inflation over time</td></tr><tr><td>Lineup composition standards</td><td>Fillers should match the witness\'s description of the perpetrator to prevent the suspect from standing out</td></tr><tr><td>Video recording of the identification procedure</td><td>Allows courts to evaluate the conditions and potential influences during the identification</td></tr></tbody></table>',
    },
  ],
  questions: [
    {
      id: 1,
      prompt: 'Using the concepts of encoding, storage, and retrieval from Chapter 8, trace how Jennifer\'s memory of her attacker was formed, how it changed over time, and what specific memory phenomena (misinformation effect, source monitoring errors, reconsolidation) likely contributed to her misidentification of Ronald Cotton.',
      wordMin: 150,
    },
    {
      id: 2,
      prompt: 'Jennifer\'s confidence in her identification increased between the initial photo lineup and the courtroom testimony. Drawing on research about confidence malleability and the relationship between confidence and accuracy, explain the psychological mechanisms that likely drove this increase. Why is this pattern particularly dangerous in a legal context?',
      wordMin: 100,
    },
    {
      id: 3,
      prompt: 'Examine the lineup reforms listed in Exhibit 2. For each reform, explain the specific cognitive or memory principle it is designed to address. Which reform do you believe would have the greatest impact on reducing misidentifications, and why?',
      wordMin: 150,
    },
    {
      id: 4,
      prompt: 'Drawing on what you have learned about cognitive development and moral reasoning from Chapter 9, consider the broader ethical question this case raises: What obligations does a society have when its legal system relies on a cognitive faculty (memory) that science has shown to be unreliable? How should developmental and cognitive psychology inform legal policy?',
      wordMin: 150,
    },
  ],
};
