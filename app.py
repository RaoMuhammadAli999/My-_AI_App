"""
SubSage - Smart Subscription Manager
Flask Backend API for managing subscriptions, analytics, and AI insights
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# In-memory storage for subscriptions
subscriptions = []
next_id = 1

# Predefined categories for subscription classification
CATEGORIES = ["Streaming", "Gaming", "Productivity", "Fitness", "Music", "Education", "Cloud Storage", "Other"]


# ==================== ROUTES ====================

@app.route('/')
def index():
    """Render the main dashboard page"""
    return render_template('index.html')


@app.route('/api/subscriptions', methods=['GET'])
def get_subscriptions():
    """Get all subscriptions"""
    return jsonify({
        'success': True,
        'subscriptions': subscriptions
    })


@app.route('/api/subscriptions', methods=['POST'])
def add_subscription():
    """Add a new subscription"""
    global next_id
    
    try:
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['name', 'cost', 'renewalDate', 'category']):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Create new subscription
        new_subscription = {
            'id': next_id,
            'name': data['name'],
            'cost': float(data['cost']),
            'renewalDate': data['renewalDate'],
            'category': data['category']
        }
        
        subscriptions.append(new_subscription)
        next_id += 1
        
        return jsonify({
            'success': True,
            'subscription': new_subscription,
            'message': 'Subscription added successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/subscriptions/<int:sub_id>', methods=['DELETE'])
def delete_subscription(sub_id):
    """Delete a subscription by ID"""
    global subscriptions
    
    # Find and remove subscription
    for i, sub in enumerate(subscriptions):
        if sub['id'] == sub_id:
            deleted_sub = subscriptions.pop(i)
            return jsonify({
                'success': True,
                'message': 'Subscription deleted successfully',
                'subscription': deleted_sub
            })
    
    return jsonify({
        'success': False,
        'error': 'Subscription not found'
    }), 404


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Calculate and return spending analytics"""
    
    # Calculate total monthly cost
    total_cost = sum(sub['cost'] for sub in subscriptions)
    
    # Calculate spending by category
    category_spending = {}
    for sub in subscriptions:
        category = sub['category']
        if category in category_spending:
            category_spending[category] += sub['cost']
        else:
            category_spending[category] = sub['cost']
    
    # Calculate subscription count
    subscription_count = len(subscriptions)
    
    # Find most expensive subscription
    most_expensive = None
    if subscriptions:
        most_expensive = max(subscriptions, key=lambda x: x['cost'])
    
    return jsonify({
        'success': True,
        'analytics': {
            'totalMonthlyCost': round(total_cost, 2),
            'subscriptionCount': subscription_count,
            'categorySpending': category_spending,
            'mostExpensive': most_expensive,
            'averageCost': round(total_cost / subscription_count, 2) if subscription_count > 0 else 0
        }
    })


@app.route('/api/ai-insights', methods=['GET'])
def get_ai_insights():
    """
    Generate AI-powered insights about spending patterns
    (Placeholder function - can be replaced with real AI API later)
    """
    
    insights = []
    tips = []
    warnings = []
    
    # Calculate some basic metrics
    total_cost = sum(sub['cost'] for sub in subscriptions)
    subscription_count = len(subscriptions)
    
    # Generate insights based on spending patterns
    if subscription_count == 0:
        insights.append({
            'type': 'info',
            'message': 'No subscriptions added yet. Start tracking to get personalized insights!'
        })
    else:
        # Insight: Total spending
        if total_cost > 100:
            insights.append({
                'type': 'warning',
                'message': f'Your monthly subscription spending is ${total_cost:.2f}. That\'s ${total_cost * 12:.2f} annually!'
            })
        else:
            insights.append({
                'type': 'success',
                'message': f'Your monthly subscription spending is ${total_cost:.2f}. You\'re managing your budget well!'
            })
        
        # Insight: Number of subscriptions
        if subscription_count > 5:
            warnings.append({
                'type': 'alert',
                'message': f'You have {subscription_count} active subscriptions. Consider consolidating to save money.'
            })
        
        # Detect duplicate or similar categories
        category_counts = {}
        for sub in subscriptions:
            category = sub['category']
            category_counts[category] = category_counts.get(category, 0) + 1
        
        for category, count in category_counts.items():
            if count > 2:
                insights.append({
                    'type': 'tip',
                    'message': f'You have {count} {category} subscriptions. You might be able to consolidate these.'
                })
        
        # Detect expensive subscriptions
        expensive_subs = [sub for sub in subscriptions if sub['cost'] > 30]
        if expensive_subs:
            for sub in expensive_subs:
                warnings.append({
                    'type': 'cost',
                    'message': f'{sub["name"]} costs ${sub["cost"]}/month. Is it worth the value?'
                })
        
        # Generate money-saving tips
        tips.extend([
            {
                'type': 'tip',
                'message': 'Look for annual plans - they often save 15-20% compared to monthly billing.'
            },
            {
                'type': 'tip',
                'message': 'Review subscriptions quarterly to cancel unused services.'
            },
            {
                'type': 'tip',
                'message': 'Check if your employer offers discounts on popular services.'
            }
        ])
        
        # Randomly select a few tips to show
        selected_tips = random.sample(tips, min(2, len(tips)))
        insights.extend(selected_tips)
    
    return jsonify({
        'success': True,
        'insights': insights,
        'summary': {
            'totalCost': round(total_cost, 2),
            'subscriptionCount': subscription_count,
            'potentialSavings': round(total_cost * 0.15, 2)  # Estimate 15% potential savings
        }
    })


@app.route('/api/coupons', methods=['GET'])
def get_coupons():
    """Get available coupon offers (hardcoded for MVP)"""
    
    coupons = [
        {
            'id': 1,
            'service': 'Netflix Premium',
            'discount': '3 months free',
            'code': 'STREAM2025',
            'description': 'Get 3 months free on annual subscription',
            'expiryDate': '2025-12-31',
            'category': 'Streaming'
        },
        {
            'id': 2,
            'service': 'Spotify Family',
            'discount': '50% off',
            'code': 'MUSIC50',
            'description': 'Save 50% on first 6 months of Family plan',
            'expiryDate': '2025-11-30',
            'category': 'Music'
        },
        {
            'id': 3,
            'service': 'Adobe Creative Cloud',
            'discount': '$20 off',
            'code': 'CREATE20',
            'description': '$20 off per month for students',
            'expiryDate': '2025-12-15',
            'category': 'Productivity'
        },
        {
            'id': 4,
            'service': 'Planet Fitness',
            'discount': '$1 enrollment',
            'code': 'FIT2025',
            'description': 'Join for just $1 enrollment fee',
            'expiryDate': '2025-10-31',
            'category': 'Fitness'
        }
    ]
    
    return jsonify({
        'success': True,
        'coupons': coupons
    })


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ==================== RUN APPLICATION ====================

if __name__ == '__main__':
    # Run Flask app on all hosts (required for Replit)
    app.run(host='0.0.0.0', port=5000, debug=True)
