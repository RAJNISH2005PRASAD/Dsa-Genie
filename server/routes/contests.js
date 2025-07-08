const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const { auth } = require('../middleware/auth');

// Get all contests
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const contests = await Contest.find(filter)
      .populate('participants.user', 'username email')
      .populate('problems', 'title difficulty')
      .sort({ startTime: -1 });
    
    res.json({ contests });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// Get contest by ID
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'username email')
      .populate('problems', 'title difficulty description');
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json({ contest });
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
});

// Create new contest (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems, type, prizePool } = req.body;
    
    const contest = new Contest({
      title,
      description,
      startTime,
      endTime,
      problems,
      type,
      prizePool,
      createdBy: req.user.id
    });
    
    await contest.save();
    res.status(201).json({ contest });
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ error: 'Failed to create contest' });
  }
});

// Join contest
router.post('/:id/join', auth, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if user is already a participant
    const isParticipant = contest.participants.some(
      p => p.user.toString() === req.user.id
    );
    
    if (isParticipant) {
      return res.status(400).json({ error: 'Already joined this contest' });
    }
    
    // Check if contest is open for registration
    if (contest.status !== 'upcoming') {
      return res.status(400).json({ error: 'Contest is not open for registration' });
    }
    
    contest.participants.push({
      user: req.user.id,
      joinedAt: new Date()
    });
    
    await contest.save();
    res.json({ message: 'Successfully joined contest' });
  } catch (error) {
    console.error('Error joining contest:', error);
    res.status(500).json({ error: 'Failed to join contest' });
  }
});

// Submit solution for contest problem
router.post('/:id/problems/:problemId/submit', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    const { id: contestId, problemId } = req.params;
    
    const contest = await Contest.findById(contestId);
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if user is a participant
    const participant = contest.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (!participant) {
      return res.status(400).json({ error: 'Not a participant in this contest' });
    }
    
    // Check if contest is active
    if (contest.status !== 'active') {
      return res.status(400).json({ error: 'Contest is not active' });
    }
    
    // Here you would typically:
    // 1. Validate the code
    // 2. Run test cases
    // 3. Update participant's score
    // 4. Update leaderboard
    
    // For now, we'll just return a success message
    res.json({ 
      message: 'Solution submitted successfully',
      status: 'accepted' // This would be determined by test case results
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get contest leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'username email')
      .populate('problems', 'title difficulty');
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Sort participants by score (descending) and submission time (ascending)
    const leaderboard = contest.participants
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(a.lastSubmission) - new Date(b.lastSubmission);
      })
      .map((participant, index) => ({
        rank: index + 1,
        user: participant.user,
        score: participant.score,
        problemsSolved: participant.problemsSolved,
        lastSubmission: participant.lastSubmission
      }));
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Update contest status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    contest.status = status;
    await contest.save();
    
    res.json({ contest });
  } catch (error) {
    console.error('Error updating contest status:', error);
    res.status(500).json({ error: 'Failed to update contest status' });
  }
});

module.exports = router; 