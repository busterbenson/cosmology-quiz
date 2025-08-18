
  // Biblical Literalism heuristics
  if (cosmologyName === 'Biblical Literalism') {
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'Y'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
  }

  // Appearance of Age heuristics
  if (cosmologyName === 'Appearance of Age') {
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'Y'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
  }

  // Catastrophism heuristics
  if (cosmologyName === 'Catastrophism') {
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'Y'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
  }

  // Evolutionary Creationism heuristics
  if (cosmologyName === 'Evolutionary Creationism') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Progressive Creation heuristics
  if (cosmologyName === 'Progressive Creation') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Teilhardian Evolution heuristics
  if (cosmologyName === 'Teilhardian Evolution') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Classical Deism heuristics
  if (cosmologyName === 'Classical Deism') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Modern Deism heuristics
  if (cosmologyName === 'Modern Deism') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Scientific Deism heuristics
  if (cosmologyName === 'Scientific Deism') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Classical Polytheism heuristics
  if (cosmologyName === 'Classical Polytheism') {
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
  }

  // Henotheism heuristics
  if (cosmologyName === 'Henotheism') {
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
  }

  // Reconstructionist Polytheism heuristics
  if (cosmologyName === 'Reconstructionist Polytheism') {
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
  }

  // Hard Polytheism heuristics
  if (cosmologyName === 'Hard Polytheism') {
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
  }

  // Traditional Animism heuristics
  if (cosmologyName === 'Traditional Animism') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Neo-Animism heuristics
  if (cosmologyName === 'Neo-Animism') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Panpsychism heuristics
  if (cosmologyName === 'Panpsychism') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Process Panentheism heuristics
  if (cosmologyName === 'Process Panentheism') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('permeates')) {
      return 'Y'
    }
    if (questionKey.includes('true') && questionKey.includes('self')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'N'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
  }

  // Emanationist Panentheism heuristics
  if (cosmologyName === 'Emanationist Panentheism') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('permeates')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'N'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
  }

  // Participatory Panentheism heuristics
  if (cosmologyName === 'Participatory Panentheism') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('permeates')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'N'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'N'
    }
  }

  // Classical Pantheism heuristics
  if (cosmologyName === 'Classical Pantheism') {
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('self') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Scientific Pantheism heuristics
  if (cosmologyName === 'Scientific Pantheism') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Monistic Pantheism heuristics
  if (cosmologyName === 'Monistic Pantheism') {
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'Y'
    }
    if (questionKey.includes('self') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Scientific Spirituality heuristics
  if (cosmologyName === 'Scientific Spirituality') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Naturalistic Buddhism heuristics
  if (cosmologyName === 'Naturalistic Buddhism') {
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Philosophical Naturalism heuristics
  if (cosmologyName === 'Philosophical Naturalism') {
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Embodied Spirituality heuristics
  if (cosmologyName === 'Embodied Spirituality') {
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Naturalistic Taoism heuristics
  if (cosmologyName === 'Naturalistic Taoism') {
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Buddhist Emptiness heuristics
  if (cosmologyName === 'Buddhist Emptiness') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('time') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Direct Experience Zen heuristics
  if (cosmologyName === 'Direct Experience Zen') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Vedantic Non-Dualism heuristics
  if (cosmologyName === 'Vedantic Non-Dualism') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Tantric Non-Dualism heuristics
  if (cosmologyName === 'Tantric Non-Dualism') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Taoist Harmony heuristics
  if (cosmologyName === 'Taoist Harmony') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Contemporary Non-Dualism heuristics
  if (cosmologyName === 'Contemporary Non-Dualism') {
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Classical Gnosticism heuristics
  if (cosmologyName === 'Classical Gnosticism') {
    if (questionKey.includes('mainstream') && questionKey.includes('history')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
    if (questionKey.includes('self') && questionKey.includes('and')) {
      return 'N'
    }
  }

  // Philosophical Dualism heuristics
  if (cosmologyName === 'Philosophical Dualism') {
    if (questionKey.includes('salvation') && questionKey.includes('through')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'N'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Modern Matrix Skepticism heuristics
  if (cosmologyName === 'Modern Matrix Skepticism') {
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('mainstream') && questionKey.includes('history')) {
      return 'Y'
    }
    if (questionKey.includes('hidden') && questionKey.includes('power')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
    if (questionKey.includes('self') && questionKey.includes('and')) {
      return 'N'
    }
  }

  // Mystical Agnosticism heuristics
  if (cosmologyName === 'Mystical Agnosticism') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('direct') && questionKey.includes('experience')) {
      return 'Y'
    }
  }

  // Pragmatic Spirituality heuristics
  if (cosmologyName === 'Pragmatic Spirituality') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('direct') && questionKey.includes('experience')) {
      return 'Y'
    }
  }

  // Philosophical Spirituality heuristics
  if (cosmologyName === 'Philosophical Spirituality') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
  }

  // Transitional Seeking heuristics
  if (cosmologyName === 'Transitional Seeking') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
  }

  // Technological Simulation heuristics
  if (cosmologyName === 'Technological Simulation') {
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
    if (questionKey.includes('reality') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'N'
    }
  }

  // Divine Simulation heuristics
  if (cosmologyName === 'Divine Simulation') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
    if (questionKey.includes('reality') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'N'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'N'
    }
  }

  // Nested Realities heuristics
  if (cosmologyName === 'Nested Realities') {
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
    if (questionKey.includes('reality') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'N'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'N'
    }
  }

  // Conscious Simulation heuristics
  if (cosmologyName === 'Conscious Simulation') {
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
  }

  // Yogācāra Buddhism heuristics
  if (cosmologyName === 'Yogācāra Buddhism') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Vajrayana Luminosity heuristics
  if (cosmologyName === 'Vajrayana Luminosity') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Analytical Idealism heuristics
  if (cosmologyName === 'Analytical Idealism') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'N'
    }
  }

  // Quantum Idealism heuristics
  if (cosmologyName === 'Quantum Idealism') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('quantum') && questionKey.includes('effects')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Transcendental Idealism heuristics
  if (cosmologyName === 'Transcendental Idealism') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('transcendence') && questionKey.includes('of')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Neutral Monism heuristics
  if (cosmologyName === 'Neutral Monism') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('mental') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('transcendence') && questionKey.includes('of')) {
      return 'Y'
    }
    if (questionKey.includes('structures') && questionKey.includes('of')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
    if (questionKey.includes('material') && questionKey.includes('world')) {
      return 'N'
    }
  }

  // Quantum Many-Worlds heuristics
  if (cosmologyName === 'Quantum Many-Worlds') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Cosmic Bubble Universes heuristics
  if (cosmologyName === 'Cosmic Bubble Universes') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Higher-Dimensional Branes heuristics
  if (cosmologyName === 'Higher-Dimensional Branes') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Cyclical Universe heuristics
  if (cosmologyName === 'Cyclical Universe') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Reductive Materialism heuristics
  if (cosmologyName === 'Reductive Materialism') {
    // Scientific/materialist approach  
    if (questionKey.includes('supernatural') || questionKey.includes('miracle')) {
      return 'N'
    }
    if (questionKey.includes('natural') || questionKey.includes('evidence')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Emergent Materialism heuristics
  if (cosmologyName === 'Emergent Materialism') {
    // Scientific/materialist approach  
    if (questionKey.includes('supernatural') || questionKey.includes('miracle')) {
      return 'N'
    }
    if (questionKey.includes('natural') || questionKey.includes('evidence')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Pragmatic Instrumentalism heuristics
  if (cosmologyName === 'Pragmatic Instrumentalism') {
    // Scientific/materialist approach  
    if (questionKey.includes('supernatural') || questionKey.includes('miracle')) {
      return 'N'
    }
    if (questionKey.includes('natural') || questionKey.includes('evidence')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Poetic Naturalism heuristics
  if (cosmologyName === 'Poetic Naturalism') {
    // Scientific/materialist approach  
    if (questionKey.includes('supernatural') || questionKey.includes('miracle')) {
      return 'N'
    }
    if (questionKey.includes('natural') || questionKey.includes('evidence')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Biblical Flat Earth heuristics
  if (cosmologyName === 'Biblical Flat Earth') {
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'Y'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
  }

  // Conspiratorial Flat Earth heuristics
  if (cosmologyName === 'Conspiratorial Flat Earth') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'N'
    }
  }

  // Experiential Flat Earth heuristics
  if (cosmologyName === 'Experiential Flat Earth') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'N'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('universes')) {
      return 'N'
    }
  }

  // Intervention Origins heuristics
  if (cosmologyName === 'Intervention Origins') {
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'Y'
    }
    if (questionKey.includes('major') && questionKey.includes('religions')) {
      return 'N'
    }
  }

  // Technological Guidance heuristics
  if (cosmologyName === 'Technological Guidance') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'N'
    }
    if (questionKey.includes('major') && questionKey.includes('religions')) {
      return 'N'
    }
  }

  // Religious Foundations heuristics
  if (cosmologyName === 'Religious Foundations') {
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'N'
    }
    if (questionKey.includes('major') && questionKey.includes('religions')) {
      return 'N'
    }
  }

  // Ongoing Presence heuristics
  if (cosmologyName === 'Ongoing Presence') {
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'Y'
    }
    if (questionKey.includes('major') && questionKey.includes('religions')) {
      return 'N'
    }
  }

  // Place-Based Knowledge heuristics
  if (cosmologyName === 'Place-Based Knowledge') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('knowledge') && questionKey.includes('tied')) {
      return 'Y'
    }
    if (questionKey.includes('non-human') && questionKey.includes('entities')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Kinship Cosmology heuristics
  if (cosmologyName === 'Kinship Cosmology') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('non-human') && questionKey.includes('entities')) {
      return 'Y'
    }
    if (questionKey.includes('direct') && questionKey.includes('experience')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Ceremonial Reality heuristics
  if (cosmologyName === 'Ceremonial Reality') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('non-human') && questionKey.includes('entities')) {
      return 'Y'
    }
    if (questionKey.includes('ceremonies') && questionKey.includes('maintain')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Ancestral Continuity heuristics
  if (cosmologyName === 'Ancestral Continuity') {
    if (questionKey.includes('ancestors') && questionKey.includes('actively')) {
      return 'Y'
    }
    if (questionKey.includes('time') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('direct') && questionKey.includes('experience')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Hidden History Researcher heuristics
  if (cosmologyName === 'Hidden History Researcher') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('mainstream') && questionKey.includes('history')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
  }

  // Alternative Physics Explorer heuristics
  if (cosmologyName === 'Alternative Physics Explorer') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('current') && questionKey.includes('scientific')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
  }

  // Conspiracy Analyst heuristics
  if (cosmologyName === 'Conspiracy Analyst') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('mainstream') && questionKey.includes('history')) {
      return 'Y'
    }
    if (questionKey.includes('hidden') && questionKey.includes('power')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
  }

  // Open Skeptic heuristics
  if (cosmologyName === 'Open Skeptic') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('mainstream') && questionKey.includes('history')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // It from Bit heuristics
  if (cosmologyName === 'It from Bit') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Computational Universe heuristics
  if (cosmologyName === 'Computational Universe') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Entropic Gravity heuristics
  if (cosmologyName === 'Entropic Gravity') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Observer-Dependent Reality heuristics
  if (cosmologyName === 'Observer-Dependent Reality') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Continuous Creation heuristics
  if (cosmologyName === 'Continuous Creation') {
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
  }

  // Dependent Existence heuristics
  if (cosmologyName === 'Dependent Existence') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
  }

  // Divine Qualities in Creation heuristics
  if (cosmologyName === 'Divine Qualities in Creation') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
  }

  // Layered Reality heuristics
  if (cosmologyName === 'Layered Reality') {
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'Y'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('does')) {
      return 'N'
    }
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
  }

  // Natural Process & Spontaneity heuristics
  if (cosmologyName === 'Natural Process & Spontaneity') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'N'
    }
  }

  // Pattern Correspondence & Complementarity heuristics
  if (cosmologyName === 'Pattern Correspondence & Complementarity') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'N'
    }
  }

  // Integral Cultivation heuristics
  if (cosmologyName === 'Integral Cultivation') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('gods') && questionKey.includes('interact')) {
      return 'N'
    }
  }

  // Many-Sided Reality heuristics
  if (cosmologyName === 'Many-Sided Reality') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('universe') && questionKey.includes('cycles')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Eternal Universe heuristics
  if (cosmologyName === 'Eternal Universe') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('universe') && questionKey.includes('cycles')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Multiple Realms heuristics
  if (cosmologyName === 'Multiple Realms') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Universal Life heuristics
  if (cosmologyName === 'Universal Life') {
    if (questionKey.includes('natural') && questionKey.includes('laws')) {
      return 'Y'
    }
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Community-Ancestral Connection heuristics
  if (cosmologyName === 'Community-Ancestral Connection') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('knowledge') && questionKey.includes('tied')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
    if (questionKey.includes('reality') && questionKey.includes('as')) {
      return 'N'
    }
  }

  // Cyclical-Sacred Time heuristics
  if (cosmologyName === 'Cyclical-Sacred Time') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('ancestors') && questionKey.includes('actively')) {
      return 'Y'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
    if (questionKey.includes('reality') && questionKey.includes('as')) {
      return 'N'
    }
  }

  // Divination-Based Causality heuristics
  if (cosmologyName === 'Divination-Based Causality') {
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('religious') && questionKey.includes('figures')) {
      return 'Y'
    }
    if (questionKey.includes('non-human') && questionKey.includes('entities')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Vitality-Force Cosmology heuristics
  if (cosmologyName === 'Vitality-Force Cosmology') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('reality') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('ancient') && questionKey.includes('monuments')) {
      return 'Y'
    }
    if (questionKey.includes('scientific') && questionKey.includes('consensus')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('misunderstood')) {
      return 'N'
    }
  }

  // Unity of Self and Cosmos heuristics
  if (cosmologyName === 'Unity of Self and Cosmos') {
    if (questionKey.includes('all') && questionKey.includes('diversity')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Sacred Manifestation heuristics
  if (cosmologyName === 'Sacred Manifestation') {
    if (questionKey.includes('reality') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Natural Harmony heuristics
  if (cosmologyName === 'Natural Harmony') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Buddhist Mind-Only heuristics
  if (cosmologyName === 'Buddhist Mind-Only') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Luminous Awareness heuristics
  if (cosmologyName === 'Luminous Awareness') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('reality') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Universal Mind heuristics
  if (cosmologyName === 'Universal Mind') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('individual') && questionKey.includes('minds')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Mind-Shaped Reality heuristics
  if (cosmologyName === 'Mind-Shaped Reality') {
    // Consciousness-first approach
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('material') && questionKey.includes('fundamental')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('fundamental')) {
      return 'Y'
    }
    if (questionKey.includes('external') && questionKey.includes('world')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('consciousness') && questionKey.includes('emerges')) {
      return 'N'
    }
    if (questionKey.includes('aliens') && questionKey.includes('intervened')) {
      return 'N'
    }
  }

  // Divine Natural Processes heuristics
  if (cosmologyName === 'Divine Natural Processes') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Guided Development heuristics
  if (cosmologyName === 'Guided Development') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Purposeful Direction heuristics
  if (cosmologyName === 'Purposeful Direction') {
    if (questionKey.includes('earth') && questionKey.includes('billions')) {
      return 'Y'
    }
    if (questionKey.includes('evolution') && questionKey.includes('as')) {
      return 'Y'
    }
    if (questionKey.includes('divine') && questionKey.includes('intervention')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('<')) {
      return 'N'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
  }

  // Consciousness-Focused heuristics
  if (cosmologyName === 'Consciousness-Focused') {
    if (questionKey.includes('consciousness') && questionKey.includes('creates')) {
      return 'Y'
    }
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
  }

  // Energy-Based heuristics
  if (cosmologyName === 'Energy-Based') {
    if (questionKey.includes('reality') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
  }

  // Evolutionary Consciousness heuristics
  if (cosmologyName === 'Evolutionary Consciousness') {
    if (questionKey.includes('humanity') && questionKey.includes('evolving')) {
      return 'Y'
    }
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('physical') && questionKey.includes('matter/energy')) {
      return 'N'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
  }

  // Eclectic Synthesis heuristics
  if (cosmologyName === 'Eclectic Synthesis') {
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('is')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('earth') && questionKey.includes('flat')) {
      return 'N'
    }
  }

  // Mystical Pantheism heuristics
  if (cosmologyName === 'Mystical Pantheism') {
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Organic Pantheism heuristics
  if (cosmologyName === 'Organic Pantheism') {
    if (questionKey.includes('all') && questionKey.includes('things')) {
      return 'Y'
    }
    if (questionKey.includes('god') && questionKey.includes('and')) {
      return 'Y'
    }
    if (questionKey.includes('non-human') && questionKey.includes('entities')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('multiple') && questionKey.includes('distinct')) {
      return 'N'
    }
    if (questionKey.includes('one') && questionKey.includes('supreme')) {
      return 'N'
    }
  }

  // Epistemological Agnosticism heuristics
  if (cosmologyName === 'Epistemological Agnosticism') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('personal') && questionKey.includes('truth')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('genesis') && questionKey.includes('historically')) {
      return 'N'
    }
    if (questionKey.includes('no') && questionKey.includes('macroevolution')) {
      return 'N'
    }
    if (questionKey.includes('scientific') && questionKey.includes('evidence')) {
      return 'N'
    }
  }

  // Perpetual Inquiry heuristics
  if (cosmologyName === 'Perpetual Inquiry') {
    // Skeptical/agnostic approach
    if (questionKey.includes('certain') || questionKey.includes('absolute')) {
      return 'N'
    }
    if (questionKey.includes('uncertain') || questionKey.includes('doubt')) {
      return 'Y'
    }
    if (questionKey.includes('openness') && questionKey.includes('to')) {
      return 'Y'
    }
    if (questionKey.includes('comfortable') && questionKey.includes('with')) {
      return 'Y'
    }
    if (questionKey.includes('practical') && questionKey.includes('results')) {
      return 'Y'
    }
  }
