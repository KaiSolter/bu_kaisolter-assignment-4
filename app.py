from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data
stop_words = stopwords.words('english')
vectorizer = TfidfVectorizer(stop_words=stop_words)
X_tfidf = vectorizer.fit_transform(documents)

n_components = 100
lsa = TruncatedSVD(n_components=n_components)
X_lsa = lsa.fit_transform(X_tfidf)

def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # TODO: Implement search engine here
    # return documents, similarities, indices 
    query_tfidf = vectorizer.transform([query])
    query_lsa = lsa.transform(query_tfidf)
    cosine_similarities = cosine_similarity(query_lsa, X_lsa)[0]
    
    top_indices = cosine_similarities.argsort()[-5:][::-1]
    top_similarities = cosine_similarities[top_indices]
    top_documents = [documents[i] for i in top_indices]
    
    return top_documents, top_similarities.tolist(), top_indices.tolist()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    documents, similarities, indices = search_engine(query)
    return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices}) 

if __name__ == '__main__':
    app.run(debug=True)
