export default {
  caseNumber: 'CI-PSY-2026-001',
  title: 'The Replication Problem — When Landmark Studies Fall Apart',
  author: 'Professor Steve Griffin',
  institution: 'Williamson College',
  date: 'Summer 2026',
  sections: [
    {
      heading: 'Background',
      content: '<p>In 2011, the field of social psychology was shaken when Diederik Stapel, a prominent Dutch professor, was found to have fabricated data in dozens of published studies. His research on topics such as how messy environments promote stereotyping had been widely cited and taught in textbooks. An investigation revealed that Stapel had invented data sets, manipulated results, and misled collaborators for over a decade. The Stapel case was extreme, but it exposed deeper vulnerabilities in how psychological science was being conducted and reviewed.</p>',
    },
    {
      heading: 'The Situation',
      content: '<p>In 2015, the Open Science Collaboration, led by Brian Nosek at the University of Virginia, published the results of one of the largest replication efforts in the history of psychology. The team attempted to replicate 100 studies published in three leading psychology journals. The results were sobering: only 36 percent of the replicated studies produced statistically significant results consistent with the original findings. Effect sizes in the replications were roughly half the magnitude of the originals. The findings sparked intense debate within the scientific community about publication bias, questionable research practices, and the incentive structures of academic publishing.</p><p>Critics of the replication project argued that failed replications did not necessarily mean the original findings were wrong. Differences in samples, cultural contexts, and procedural details could explain discrepancies. Supporters countered that if findings could not withstand minor variations, their robustness and theoretical value were questionable. The debate forced psychologists to confront uncomfortable questions about how science polices itself.</p>',
    },
    {
      heading: 'The Institutional Response',
      content: '<p>Major journals began adopting new practices in response to the crisis. Pre-registration of studies, in which researchers publicly commit to their hypotheses and methods before collecting data, became increasingly common. Open data policies encouraged researchers to share their raw data sets. Some journals introduced Registered Reports, a format in which studies are peer-reviewed and accepted for publication based on their methods before results are known, eliminating the bias toward publishing only positive findings.</p><p>Universities also began examining their incentive structures. The "publish or perish" culture had long rewarded quantity and novelty over rigor and replication. Some institutions started to value replication studies in tenure decisions and to invest in training graduate students in open science practices. However, progress was uneven, and many researchers worried that the changes were more cosmetic than structural.</p>',
    },
    {
      heading: 'The Human Cost',
      content: '<p>The replication crisis had personal consequences. Early-career researchers who attempted replications sometimes faced hostility from the original authors, who viewed replication failures as personal attacks. Graduate students who invested months in replication studies found them difficult to publish in top journals. Meanwhile, public trust in psychological science eroded, with media headlines declaring that psychology was "broken." For a discipline that depends on public trust for research funding and clinical credibility, the stakes extended far beyond academic journals.</p>',
    },
  ],
  exhibits: [
    {
      title: 'Exhibit 1: Open Science Collaboration Replication Results (2015)',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Journal</th><th>Studies Attempted</th><th>Successful Replications</th><th>Replication Rate</th></tr></thead><tbody><tr><td>Journal of Personality and Social Psychology</td><td>55</td><td>14</td><td>25%</td></tr><tr><td>Journal of Experimental Psychology: Learning, Memory, and Cognition</td><td>26</td><td>14</td><td>54%</td></tr><tr><td>Psychological Science</td><td>19</td><td>8</td><td>42%</td></tr><tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>36</strong></td><td><strong>36%</strong></td></tr></tbody></table>',
    },
    {
      title: 'Exhibit 2: Timeline of Key Events in the Replication Crisis',
      content: '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;"><thead><tr><th>Year</th><th>Event</th></tr></thead><tbody><tr><td>2011</td><td>Diederik Stapel fraud case exposed; Daryl Bem publishes controversial precognition study in a top journal</td></tr><tr><td>2012</td><td>The Reproducibility Project launches at the Center for Open Science</td></tr><tr><td>2013</td><td>First major replication failures of prominent priming studies reported</td></tr><tr><td>2015</td><td>Open Science Collaboration publishes results: 36% replication rate across 100 studies</td></tr><tr><td>2017</td><td>Many-Labs 2 project replicates 28 classic findings across 125 samples in 36 countries</td></tr><tr><td>2018-Present</td><td>Pre-registration, open data, and Registered Reports become increasingly standard practice</td></tr></tbody></table>',
    },
  ],
  questions: [
    {
      id: 1,
      prompt: 'Using the concepts from Chapter 2 on psychological research methods, identify at least three specific "questionable research practices" that contributed to the replication crisis. For each practice, explain how it undermines the scientific method and propose a concrete safeguard against it.',
      wordMin: 150,
    },
    {
      id: 2,
      prompt: 'Examine the data in Exhibit 1. Why do you think the replication rate differed across the three journals? Consider the types of research each journal typically publishes and what methodological factors might make some findings more replicable than others.',
      wordMin: 100,
    },
    {
      id: 3,
      prompt: 'The replication crisis raises a fundamental question: How do we know what we know? Drawing on the principles of the scientific method discussed in your textbook, argue whether a single failed replication should be sufficient to discard a finding, or whether science requires a more nuanced approach. Defend your position with specific reasoning.',
      wordMin: 150,
    },
    {
      id: 4,
      prompt: 'Consider the tension between the incentive structures of academia (publish or perish, novelty bias) and the ideals of the scientific method (objectivity, replicability, self-correction). How might the culture of academic psychology be reformed to better align incentives with scientific integrity? Propose at least two structural changes and explain why each would be effective.',
      wordMin: 150,
    },
  ],
};
