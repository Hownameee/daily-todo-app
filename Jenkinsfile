pipeline {
    agent none 

    stages {
        stage("Node Environment") {
            agent {
                docker { 
                    image 'node:22'
                    reuseNode true
                    args '-u root'
                }
            }
            stages {
                stage("Install") {
                    steps {
                        sh 'npm install --ignore-scripts'
                        sh 'npx buf generate'
                    }
                }

                stage("Linting") {
                    steps {
                        sh 'npx turbo run lint' 
                    }
                }

                stage("Build") {
                    steps {
                        sh 'npx turbo run build' 
                    }
                }
            }
        }

        stage("Deploy") {
            agent any 
            
            environment {
                MONGODB_URI = credentials('MONGODB_URI')
            }
            
            steps {
                sh 'docker build -t daily-todo-app .'
                sh 'docker rm -f daily-todo-container || true'
                sh 'docker run -dp 3000:4000 --name daily-todo-container -e MONGOURI=$MONGODB_URI daily-todo-app'
            }
        }
    }
}